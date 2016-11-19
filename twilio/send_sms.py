from twilio.rest import TwilioRestClient


import csv
import sys

f = open(sys.argv[1], 'rt')

subject = input("Who do you want to text? ")

try:
    reader = csv.reader(f)
    for row in reader:
    	name = row[0]
    	number = row[1]
    	if name == subject:
        	destination = '+' + number
finally:
    f.close()
		

text = input("What do you want to say? ")

account_sid = "AC938472e9120f0c46d2f7e15a61825d4a" # Your Account SID from www.twilio.com/console
auth_token  = "9fede4428c7bd0fc4586a0954da61b9a"  # Your Auth Token from www.twilio.com/console

client = TwilioRestClient(account_sid, auth_token)

message = client.messages.create(
	body=text,
    to=destination,    # Replace with your phone number
    from_="+12242035200 ") # Replace with your Twilio number

print(message.sid)