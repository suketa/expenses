require 'json'
require 'aws-sdk-dynamodb'

class ExpensesCreator
  VERSION = '0.0.1'.freeze

  def initialize(event, _context)
    @event = event
  end

  def run
    record = record(@event)
    param = update_item_param(dkey(record), record['cost'])
    dynamodb.update_item(param)
    response(200, 'success')
  rescue StandardError => e
    puts "Error: #{e.class}, #{e.message}, event=#{@event.inspect}"
    response(400, "failed to insert record, #{e.message}")
  end

  private

  def record(event)
    JSON.parse(event['body'])
  end

  def dkey(record)
    prefix = suffix = ''
    if record['income']
      prefix = 'income_'
    else
      suffix = "##{record['key']}"
    end
    "#{prefix}#{Time.now.strftime('%Y%m%dT%H%M%S.%L')}#{suffix}"
  end

  def update_item_param(key, cost)
    {
      table_name: ENV['EXPENSES_TABLE'],
      key: {
        dkey: key
      },
      expression_attribute_values: {
        ':cost' => cost,
        ':initial_cost' => 0
      },
      update_expression: 'SET cost = if_not_exists(cost, :initial_cost) + :cost'
    }
  end

  def response(code, message)
    {
      statusCode: code,
      body: {
        message: message
      }.to_json
    }
  end

  def dynamodb
    @dynamodb ||= Aws::DynamoDB::Client.new
  end
end

#
# Expected JSON Body
#
# {
#   key: "book",
#   cost: 2000
# }
#
def lambda_handler(event:, context:)
  creator = ExpensesCreator.new(event, context)
  creator.run
end
