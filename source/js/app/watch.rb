# Script to watch current directory for any changes to file
# and excecute actions on it.
#
# USAGE: ruby watch.rb
#  
require 'rubygems'
require 'fssm'

# Monitor
FSSM.monitor('.' ,'*.js') do
  update do |base|
    command = "make"
    %x{#{command}}
    puts "Updated."
  end
end


