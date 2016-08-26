class Group < ApplicationRecord
  validates :grp_name, :presence => true, :uniqueness => true
  
  has_and_belongs_to_many :users
  has_many :messages
end
