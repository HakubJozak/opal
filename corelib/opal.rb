require 'runtime'
require 'module'
require 'class'
require 'basic_object'
require 'kernel'
require 'nil_class'
require 'boolean'
require 'error'
require 'regexp'
require 'comparable'
require 'enumerable'
require 'enumerator'
require 'array'
require 'hash'
require 'string'
require 'numeric'
require 'proc'
require 'range'
require 'time'
require 'struct'
require 'native'
require 'io'

# regexp matches
$& = $~ = $` = $' = nil

# stub library path
$:            = []

# split lines
$/            = "\n"
$,            = " "

# native global
$$ = $global = Native(`Opal.global`)

ARGV          = []
ARGF          = Object.new
ENV           = {}
TRUE          = true
FALSE         = false
NIL           = nil

STDERR        = $stderr = Object.new
STDIN         = $stdin  = Object.new
STDOUT        = $stdout = Object.new

RUBY_PLATFORM = 'opal'
RUBY_ENGINE   = 'opal'
RUBY_VERSION  = '1.9.3'
RUBY_ENGINE_VERSION = '0.4.3'
RUBY_RELEASE_DATE = '2013-07-24'

def self.to_s
  'main'
end

def self.include(mod)
  Object.include mod
end
