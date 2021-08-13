require 'json'
require 'aws-sdk-dynamodb'

class ExpensesGraphData
  VERSION = '0.0.1'.freeze

  def initialize(event, _context)
    @event = event
  end

  def run
    data = query_data
    response(200, 'success', data)
  rescue StandardError => e
    puts "Error: #{e.class}, #{e.message}, event=#{@event.inspect}, #{e.backtrace}"
    response(400, "failed to query record. #{e.class} #{e.message}", '')
  end

  private

  def query_data
    year = @event.dig('pathParameters', 'year')
    last_year = (year.to_i - 1).to_s
    ydata = db_query(year)
    ldata = db_query(last_year)
    merge_data(ydata, ldata)
  end

  def db_query(year)
    res = dynamodb.query(query_param(year))
    res.items.to_h do |item|
      [item['dkey'][-2..], item['cost'].to_i]
    end
  end

  def query_param(year)
    {
      table_name: ENV['EXPENSES_TABLE'],
      projection_expression: 'dkey, cost',
      key_conditions: {
        'uid' => {
          attribute_value_list: [year],
          comparison_operator: 'EQ'
        }
      }
    }
  end

  def merge_data(ydata, ldata)
    (1..12).to_a.map do |i|
      month = format('%02d', i)
      { month: month, cost: ydata[month] || 0, lcost: ldata[month] || 0 }
    end
  end

  def response(code, message, data)
    {
      statusCode: code,
      headers: {
        "Access-Control-Allow-Origin": '*'
      },
      body: {
        message: message,
        data: data
      }.to_json
    }
  end

  def dynamodb
    @dynamodb ||= Aws::DynamoDB::Client.new
  end
end

#
# Expected Parameter
#
#   /graphdata/{year}
#
# example
#   /graphdata/2021
#
def lambda_handler(event:, context:)
  graphdata = ExpensesGraphData.new(event, context)
  graphdata.run
end
