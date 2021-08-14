require 'json'
require 'dynamodb_accessor'

class ExpensesTrigger
  include DynamoDBAccessor

  VERSION = '0.0.1'.freeze

  def initialize(dynamodb: nil)
    @dynamodb = dynamodb
  end

  def run(event, _context)
    return if event['Records'].size == 1 && summary?(event['Records'][0]['dynamodb'])

    total_costs = sub_summary(event['Records'])
    total_costs.each do |key, cost|
      next if key == 'ignore'

      update_total_cost(key, cost) if cost != 0
    end
  rescue StandardError => e
    puts "Error: #{e.class}, #{e.message}, event=#{@event.inspect}, #{e.backtrace}"
  end

  def sub_summary(records)
    h = {}.tap { |hash| hash.default = 0 }
    records.each_with_object(h) do |rec, summary|
      key, keymonth, keyyear, value = cost(rec['dynamodb'])
      summary[key] += value unless key == 'ignore'
      summary[keymonth] += value unless keymonth == 'ignore'
      summary[keyyear] += value unless keyyear == 'ignore'
    end
  end

  def summary?(record)
    !transaction?(record)
  end

  def income?(record)
    dkey(record)&.start_with?('income')
  end

  def transaction?(record)
    dkey = dkey(record)
    dkey&.start_with?(/^\d/) || dkey&.start_with?('income')
  end

  def sub_summary_key(record)
    dkey = dkey(record)
    income?(record) ? 'ignore' : "group_month_item_#{dkey.gsub(/\d{2}T\d{6}\.\d{3}/, '')}"
  end

  def summary_key_month(record)
    dkey = dkey(record)
    income?(record) ? 'ignore' : "group_month_#{dkey[0, 6]}"
  end

  def summary_key_year(record)
    dkey = dkey(record)
    income?(record) ? "group_income_year_#{dkey[7, 4]}" : "group_year_#{dkey[0, 4]}"
  end

  def cost(record)
    return ['ignore', 'ignore', 'ignore', 0] unless transaction?(record)

    new_cost = record['NewImage'] ? cost_value(record['NewImage']) : 0
    old_cost = record['OldImage'] ? cost_value(record['OldImage']) : 0
    [sub_summary_key(record).to_s, summary_key_month(record).to_s, summary_key_year(record).to_s, new_cost - old_cost]
  end

  def cost_value(image)
    image['cost']['N'].to_i
  end

  def update_total_cost(key, total_cost)
    key1, key2 = split_key(key)
    param = update_item_param(key1, key2, total_cost)
    dynamodb.update_item(param)
  end

  def split_key(key)
    case key
    when /\Agroup_month_item_(\d{6})/
      [Regexp.last_match(1), key]
    when /\Agroup_income_year_(\d{3})\d{1}/
      ["#{Regexp.last_match(1)}0I", key]
    when /\Agroup_year_(\d{3})\d{1}/
      ["#{Regexp.last_match(1)}0C", key]
    when /\Agroup_month_(\d{4})/
      [Regexp.last_match(1), key]
    end
  end

  def update_item_param(uid, dkey, total_cost)
    {
      table_name: ENV['EXPENSES_TABLE'],
      key: {
        uid: uid,
        dkey: dkey
      },
      expression_attribute_values: {
        ':total_cost' => total_cost,
        ':initial_cost' => 0
      },
      update_expression: 'SET cost = if_not_exists(cost, :initial_cost) + :total_cost'
    }
  end

  def dkey(record)
    record.dig('Keys', 'dkey', 'S')
  end
end

def handler(event:, context:)
  puts "ExpensesTrigger::VERSION = #{ExpensesTrigger::VERSION}"
  trigger = ExpensesTrigger.new
  trigger.run(event, context)
end
