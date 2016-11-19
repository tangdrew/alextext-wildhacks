from twilio.rest import TwilioRestClient
import csv

contacts = {}
csvfile = open('contacts.csv')
reader=csv.reader(csvfile)
for row in reader:
	contacts[row[0]] = row[1]


person = input('Who do you want to text? ')
mess = input('What do you want to say? ')
dest = (contacts[person])

account_sid = "AC938472e9120f0c46d2f7e15a61825d4a" # Your Account SID from www.twilio.com/console
auth_token  = "9fede4428c7bd0fc4586a0954da61b9a"  # Your Auth Token from www.twilio.com/console

client = TwilioRestClient(account_sid, auth_token)
if mess != 'Nevermind':
	message = client.messages.create(body=mess,
	    to=dest,
	    from_="+12242035200") # Twilio from-number

