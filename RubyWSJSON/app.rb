require 'sinatra'
require 'em-websocket'
require 'thin'

EventMachine.run {

    @channels = Hash.new{ |h,k| h[k] = { :channel => EM::Channel.new } }
    @data_resp = false

    EventMachine::WebSocket.start(:host => "0.0.0.0", :port => 8080) do |ws|
        def check_response(conn)
            if @data_resp == false
                puts "ping/ponged out"
                conn.close_connection
            end
        end

        timer = nil
        ws.onopen {
            room = ws.request["path"].split("/")[1]
            if room
                sid = @channels[room][:channel].subscribe{ |msg| ws.send msg }
            else
                puts "probably close this or something..."
            end

            ws.onclose {
                # DESTROY THEM!!!!
                @channels[room][:channel].unsubscribe(sid)
                @channels[room][:clients].delete(sid)
            }

            ws.onmessage { |msg|
                begin
                    message = JSON.parse( msg )
                    puts message
                rescue Exception => e
                    puts "could not parse JSON."
                    puts e
                end
            }
        }
    end

    App.run!({ :port => 8989 })
}