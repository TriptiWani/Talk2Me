class AddCategoryToMessage < ActiveRecord::Migration[5.0]
  def change
    add_column :messages, :category, :string
  end
end
