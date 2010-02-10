# Sunlight Widgets

A project funded by the Knight Foundation.

## Set up

This is a Rails 3 app, so make note of the required use of the `bundler` gem.

* [Rails 3 beta](http://weblog.rubyonrails.org/2010/2/5/rails-3-0-beta-release) install notes
* [Bundler](http://yehudakatz.com/2010/02/09/using-bundler-in-real-life/) usage notes

If you have commit rights:

    git clone git@github.com:sunlightlabs/widgets.git
    
Read-only:

    git clone git://github.com/sunlightlabs/widgets.git
    
Install the required gems:
    
    bundle install
    
Note that the `script/xxx` methods are now replaced with the `rails` command.

    rails console
    rails server

## Features

A basic bio widget example is live at:

    http://widgets.local/widgets/bio

Search works. Just put in a name, district, state, or street address.

Replace `widgets.local` with your localhost name and port.