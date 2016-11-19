from twilio.rest import TwilioRestClient
import csv

# load contacts into dictionary

contacts = {}
csvfile = open('./contacts.csv')
reader=csv.reader(csvfile)
for row in reader:
	contacts[row[0]] = row[1]


# person = input('Who do you want to text? ')
# mess = input('What do you want to say? ')
# dest = (contacts[person])

account_sid = "AC938472e9120f0c46d2f7e15a61825d4a" # Your Account SID from www.twilio.com/console
auth_token  = "9fede4428c7bd0fc4586a0954da61b9a"  # Your Auth Token from www.twilio.com/console

client = TwilioRestClient(account_sid, auth_token)

def send():
	dest = input("Who do you want to text? ")
	mess = input("What do you want to say? ")
	
	if mess != 'Nevermind':
		message = client.messages.create(
			body=mess,
			to=contacts[dest],
			from_="+12242035200")

def get_list(phone_number, n):
	lst = client.messages.list()
	script = []
	convo = []
	for i in range(0,len(lst)):
		if (lst[i].to == phone_number) or lst[i].from_ == phone_number:
			# print (lst[i].from_, lst[i].to, lst[i].body, lst[i].date_sent)
			convo.append(lst[i])
	for i in range(0,len(convo[0:n])):
		script.append(convo[n-i-1])
	return script
		
send()

# c = get_list(contacts["Coby"],4)
# for i in range(0, len(c)):
# 	print(c[i].date_sent)