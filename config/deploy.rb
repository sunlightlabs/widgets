set :environment, (ENV['target'] || 'staging')

set :user, 'widgets'
set :application, user
set :deploy_to, "/home/#{user}/www"

if environment == 'production'
  set :domain, "politiwidgets.com"
else
  set :domain, "widgets.sunlightlabs.com"
end

set :repository,  "git@github.com:sunlightlabs/widgets.git"
set :scm, 'git'
set :use_sudo, false
set :deploy_via, :remote_cache

role :web, domain
role :app, domain
role :db,  domain, :primary => true 

after "deploy", "deploy:cleanup"

namespace :deploy do
  task :restart, :roles => :app, :except => { :no_release => true } do
    run "touch #{current_path}/tmp/restart.txt"
  end
  
  task :symlink_config do
    shared_config = File.join(shared_path, 'config')
    release_config = "#{release_path}/config"
    %w{widgets settings}.each do |file|
      run "ln -s #{shared_config}/#{file}.yml #{release_config}/#{file}.yml"
    end
  end
end

namespace :bundler do
  task :install do
    run("gem install bundler")
  end

  task :symlink_vendor do
    shared_gems = "#{shared_path}/vendor/gems"
    release_gems = "#{release_path}/vendor/gems"
    run("mkdir -p #{shared_gems} && mkdir -p #{release_gems} && rm -rf #{release_gems} && ln -s #{shared_gems} #{release_gems}")
  end

  task :bundle do
    bundler.symlink_vendor
    run("cd #{release_path} && export PATH=/home/widgets/.gem/ruby/1.8/bin:$PATH && bundle install")
  end
end

after 'deploy:update_code' do
  bundler.bundle
  deploy.symlink_config
end