Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-24.04"

  # VM 1 
  config.vm.define :vm1 do |vm1|
    vm1.vm.hostname = "vm1"
    vm1.vm.network "private_network", ip: "192.168.22.3"

    vm1.vm.provider "virtualbox" do |vb|
      vb.memory = "1024"
    end
  end

  # VM 2
  config.vm.define :vm2 do |vm2|
    vm2.vm.hostname = "vm2"
    vm2.vm.network "private_network", ip: "192.168.22.4"

    vm2.vm.synced_folder ".", "/vagrant_data", 
    type: "rsync",
    rsync__exclude: ["node_modules/"]

    vm2.vm.provider "virtualbox" do |vb|
      vb.memory = "2048"
    end
    vm2.vm.provision "shell", inline: <<-SHELL
      apt-get update
      apt-get install -y curl

      curl -fsSL https://deb.nodesource.com/setup_22.x | bash -

      apt-get install -y nodejs
      node -v
      npm -v

      cd /vagrant_data
      npm install
    SHELL
  end
end
