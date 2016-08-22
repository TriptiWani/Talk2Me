class CreateGroups < ActiveRecord::Migration[5.0]
  def change
    create_table :groups do |t|
      t.string :grp_name
      t.text :grp_image
      t.integer :grp_admin_id

      t.timestamps
    end
  end
end
