require 'json'
require 'expenses_api_base'
require 'dynamodb_accessor'

class ExpensesCreator < ExpensesApiBase
  include DynamoDBAccessor

  private

  def pure_run
    record = record(@event)
    dkey = dkey(record)
    uid = uid(dkey)
    param = update_item_param(uid, dkey, record['cost'])
    dynamodb.update_item(param)
    response(200, 'success')
  end

  def response_error_message
    'failed to insert'
  end

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

  def uid(dkey)
    if /\A[^\d]*(\d{8})T/ =~ dkey
      Regexp.last_match(1)
    end
  end

  def update_item_param(uid, dkey, cost)
    {
      table_name: ENV['EXPENSES_TABLE'],
      key: {
        uid: uid,
        dkey: dkey
      },
      expression_attribute_values: {
        ':cost' => cost,
        ':initial_cost' => 0
      },
      update_expression: 'SET cost = if_not_exists(cost, :initial_cost) + :cost'
    }
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
  creator = ExpensesCreator.new(event, context)
  creator.run
end
