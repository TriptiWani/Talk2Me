class User < ApplicationRecord
  has_secure_password

  validates :name, :presence => true, :uniqueness => true

  has_many :messages
  has_and_belongs_to_many :groups
end
