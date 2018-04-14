require "rubygems"
require "digest"

class Block
    
	def initialize(_index, _timestamp, _data, _previous_hash)
		@index = _index
		@timestamp = _timestamp
		@data = _data
		@previous_hash = _previous_hash
		@hash = hash_block
	end

	def index
		@index
	end

	def timestamp
		@timestamp
	end

	def data
		@data
	end

	def previous_hash
		@previous_hash
	end

	def hash
		@hash
	end

	def hash_block
		sha = Digest::SHA256.new
		sha.update @index.to_s + @timestamp.to_s + @data.to_s + previous_hash.to_s
		sha.hexdigest
    end
    
end

def create_genesis_block
    Block.new(0, Time.now.strftime("%Y-%m-%d %H:%M:%S.%6N"), "Genesis Block", "0")
end

def next_block(last_block)
    this_index = last_block.index + 1
    this_timestamp = Time.now.strftime("%Y-%m-%d %H:%M:%S.%6N")
    this_data = "Hey! I'm a block" + this_index.to_s
    this_hash = last_block.hash
    Block.new(this_index, this_timestamp, this_data, this_hash)
end
# Create the blockchain and add the genesis block
blockchain = [create_genesis_block]
previous_block = blockchain[0]

=begin 
How many blocks should we add to the chain
after the genesis block
=end
num_of_blocks_to_add = 20
for i in 0..num_of_blocks_to_add
	block_to_add = next_block(previous_block)
	blockchain.push block_to_add
	previous_block = block_to_add
	puts "Block #{block_to_add.index} has been added to blockchain!"
	puts "Hash: #{block_to_add.hash}\n"
end