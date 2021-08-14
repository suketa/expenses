require 'json'
require 'dynamodb_accessor'

class ExpensesMonthlyEntry
  include DynamoDBAccessor

  VERSION = '0.0.1'.freeze

  def initialize(event, _context)
    @event = event
  end

  def run
    create_monthly_entry
    response(200, 'success', '')
  rescue StandardError => e
    puts "Error: #{e.class}, #{e.message}, event=#{@event.inspect}, #{e.backtrace}"
    response(400, "failed to query record. #{e.class} #{e.message}", '')
  end

  def create_monthly_entry
    master = master_monthly
    param = batch_write_param(master.item['costs'])
    dynamodb.batch_write_item(param)
  end

  private

  def batch_write_param(costs)
    {
      request_items: {
        ENV['EXPENSES_TABLE'] => expenses_requests(costs)
      }
    }
  end

  def expenses_requests(costs)
    costs.each_with_object([]) do |item, ary|
      uid, dkey = keys(item[0])
      cost = item[1].to_i
      ary << put_request(uid, dkey, cost)
    end
  end

  def put_request(uid, dkey, cost)
    {
      put_request: {
        item: {
          'uid' => uid,
          'dkey' => dkey,
          'cost' => cost
        }
      }
    }
  end

  def keys(item)
    dkey = "#{Time.now.strftime('%Y%m%dT%H%M%S.%L')}##{item}"
    uid = dkey[0, 8]
    [uid, dkey]
  end

  def master_monthly
    dynamodb.get_item(
      {
        table_name: ENV['EXPENSES_TABLE'],
        key: {
          'uid' => 'master',
          'dkey' => 'monthly'
        },
        projection_expression: 'costs'
      }
    )
  end

  def response(code, message, data)
    {
      statusCode: code,
      body: {
        message: message,
        data: data
      }.to_json
    }
  end
end

def handler(event:, context:)
  monthly_entry = ExpensesMonthlyEntry.new(event, context)
  monthly_entry.run
end
