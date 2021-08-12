require 'json'
require 'aws-sdk-dynamodb'

class ExpensesMonthlyEntry
  VERSION = '0.0.1'.freeze

  def initialize(event, _context)
    @event = event
  end

  def run
    p @event
  end
end

def handler(event:, context:)
  monthly_entry = ExpensesMonthlyEntry.new(event, context)
  monthly_entry.run
end
