u1 = User.create(:name=>"Triptii",:email_id=>"tripti.895@gmail.com", :password => "chicken" ,:password_confirmation=>"chicken")
u2 = User.create(:name=>"Kym",:email_id=>"kym@ga.com", :password => "chicken" ,:password_confirmation=>"chicken")
u3 = User.create(:name=>"Lori",:email_id=>"lori@ga.com", :password => "chicken" ,:password_confirmation=>"chicken")

g1 = Group.create(:grp_name => 'Cousins')
g1.grp_admin_id = u1.id

g2 = Group.create(:grp_name => 'Hiking')
g2.grp_admin_id = u2.id

g3 = Group.create(:grp_name => 'BBQ')
g3.grp_admin_id = u1.id

m1 = Message.create(:content => 'Hi Cousins ')
m1.user_id = u1
m1.group_id = g1

m2 = Message.create(:content => 'Welcome to this hiking group ')
m2.user_id = u1
m2.group_id = g2

c1 = Contact.create(:user_id => u2.id , :group_id => g1.id)
c2 = Contact.create(:user_id => u1.id , :group_id => g2.id)
c3 = Contact.create(:user_id => u3.id , :group_id => g2.id)
