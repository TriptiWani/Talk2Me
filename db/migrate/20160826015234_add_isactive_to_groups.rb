class AddIsactiveToGroups < ActiveRecord::Migration[5.0]
  def change
    add_column :groups, :is_active, :boolean, default:true
  end
end
