class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :name
      t.string :email_id
      t.string :facebook_id
      t.string :phone_number
      t.text :image

      t.timestamps
    end
  end
end
