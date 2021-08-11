require 'json'
require 'aws-sdk-dynamodb'

class ExpensesGraphData
  VERSION = '0.0.1'.freeze

  def initialize(event, _context)
    @event = event
    pp event['pathParameters'] 
    pp _context
  end

  def run
    response(200, "success")
  rescue StandardError => e
    puts "Error: #{e.class}, #{e.message}, event=#{@event.inspect}"
    response(400, "failed to insert record, #{e.message}")
  end

  private

  def response(code, message)
    {
      statusCode: code,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
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
#   cost: 2000,
#   income: false
# }
#
def lambda_handler(event:, context:)
  getter = ExpensesGraphData.new(event, context)
  getter.run
end
