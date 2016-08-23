class Group < ApplicationRecord
  # has_many :users
  has_and_belongs_to_many :users
  has_many :messages
  # has_many :contacts
end
