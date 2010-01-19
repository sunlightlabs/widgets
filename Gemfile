# Edit this Gemfile to bundle your application's dependencies.
directory "/Users/luigi/Sunlight/Source/rails", :glob => "{*/,}*.gemspec"

git "git://github.com/rails/arel.git" 
git "git://github.com/rails/rack.git"

## Bundle edge rails:
gem "rails", "3.0.pre"

## Bundle the gems you use:
# gem "bj"
# gem "hpricot", "0.6"
gem "sqlite3-ruby", :require_as => "sqlite3"
# gem "aws-s3", :require_as => "aws/s3"
gem "mongo_mapper"
gem "nifty-generators"

## Bundle gems used only in certain environments:
# gem "rspec", :only => :test
only :test do
  gem "rspec"
  gem "cucumber"
  gem "webrat"
end
