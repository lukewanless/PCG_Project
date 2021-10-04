
#Libraries for the Grammar section
import random
import statistics
import math
from collections import defaultdict

#For assessing runtime
from datetime import datetime
startTime = datetime.now()


number_to_generate = int(input("How many Missions would you like to Generate? "))
#number_to_generate = int(10000)

#------------------------------------------------------------------------------------------------------------------------------------
# Grammar class and methods are the work of Eli Bendersky, January 2010
# from https://eli.thegreenplace.net/2010/01/28/generating-random-sentences-from-a-context-free-grammar/

#this value defines a convergence property of the recursive patterns, to avoid inifite recursion
convergence_factor = 0.9

def weighted_choice(weights):
            rnd = random.random() * sum(weights)
            for i, w in enumerate(weights):
                rnd -= w
                if rnd < 0:
                    return i

class CFG(object):
    def __init__(self):
        self.prod = defaultdict(list)

    def add_prod(self, lhs, rhs):
        prods = rhs.split('|')
        for prod in prods:
            self.prod[lhs].append(tuple(prod.split()))

    def gen_random(self, symbol):

        sentence = ''

        # select one production of this symbol randomly
        rand_prod = random.choice(self.prod[symbol])

        for sym in rand_prod:
            # for non-terminals, recurse
            if sym in self.prod:
                sentence += self.gen_random(sym)
            else:
                sentence += sym + ' '

        return sentence

    def gen_random_convergent(self, symbol, cfactor = convergence_factor, pcount=defaultdict(int)):

        sentence = ''

        weights = []
        for prod in self.prod[symbol]:
            if prod in pcount:
                weights.append(cfactor ** (pcount[prod]))
            else:
                weights.append(1.0)

        rand_prod = self.prod[symbol][weighted_choice(weights)]
        
        pcount[rand_prod] += 1

        for sym in rand_prod:
            # for non-terminals, recurse
            if sym in self.prod:
                sentence += self.gen_random_convergent(sym,cfactor=cfactor,pcount=pcount)
            else:
                sentence += sym + ' '

        # backtracking: clear the modification to pcount
        pcount[rand_prod] -= 1
        return sentence
#------------------------------------------------------------------------------------------------------------

#Grammar Rules
grammar = CFG()
grammar.add_prod("Dungeon","Start Room Content Room End")
grammar.add_prod("Content", "Content Key Content Lock Content | Enemy Room | Room Content | Room | Content Content | Level")
grammar.add_prod("","")

#Rest of code, Alexander Gellel, u6048084, Australian National University

#List of Dungeons (for generating more than one at a time)
dungeons = []

for i in range(number_to_generate):
    theDungeon = grammar.gen_random_convergent('Dungeon') 
    dungeons.append(theDungeon)


#A dungeon as defined by Dormans in his work
#grammar2 = CFG()
#grammar2.add_prod("Dungeon","Start Obstacle End")
#grammar2.add_prod("Obstacle", "Key Obstacle Lock Obstacle | Monster Obstacle | Room ")
#grammar2.add_prod("","")

#for i in range(100):
#    theDungeon2 = grammar2.gen_random_convergent('Dungeon') 
#    dungeons.append(theDungeon2)

dungeon = max(dungeons, key=len)

#---Auxialiary Functions----

def second_smallest(numbers):
    val1, val2 = float('inf'), float('inf')
    for x in numbers:
        if x <= val1:
            val1, val2 = x, val1
        elif x < val2:
            val2 = x
    return val2

def takeSecond(elem):
    return elem[1]
#-------------------------


# Simple Fitness function - these rules are somewhat arbitrary and serve only to verify the flexibility of the technique
def fitnessFunction(inputString):
    score = 0

    dungeonArray = inputString.split(' ')
    roomCount = len(dungeonArray)
    lockCount = dungeonArray.count("Lock")
    
    #Edit of code, Luke Wanless, u7120506, Australian National University (all following mentions of 'Level') 
    levelCount = dungeonArray.count("Level")
    
    if levelCount == 0:
        return score

    #Quality of number of locks. Protect against too big or too small
    if lockCount == 0:
        return score
    
     #Quality of number of levels as a percentage of the number of rooms 
    if roomCount/levelCount < 20 and roomCount/levelCount > 10:
        score = score + 10; 

    if lockCount > 2 and lockCount < 8:
        #Good range
        score = score + 10
    elif lockCount > 1 and lockCount < 9:
        #Less good
        score = score + 5
    else:
        #Probably too big
        score = score + 0.5

    #Quality of number of Rooms. Don't want it to be too small. This is arbitrary however
    if roomCount >= 20 and roomCount <= 50:
        score = score + 10
    elif roomCount >= 50 and roomCount <= 60:
        score = score + 5
    else: 
        score = score + 0.5
   
    #Level density/proximity
    levelGaps = []
    counter = 0
    for entry in dungeonArray:
        if entry == "Level":
            levelGaps.append(counter)
            counter = 0
        else:
            counter+=1

    #The value assigned to the quality of level gaps        
    levelGapValue =  (min(levelGaps)+1)
    if levelCount >= 2:
        levelGapValue2 = (second_smallest(levelGaps)+1)
    else:
        levelGapValue2 = 0

    #Lock density/proximity
    lockGaps = []
    counter = 0
    for entry in dungeonArray:
        if entry == "Lock":
            lockGaps.append(counter)
            counter = 0
        else:
            counter+=1

    #The value assigned to the quality of lock gaps        
    lockGapValue =  (min(lockGaps)+1)
    if lockCount >= 2:
        lockGapValue2 = (second_smallest(lockGaps)+1)
    else:
        lockGapValue2 = 0

    score = score + lockGapValue + lockGapValue2 + levelGapValue + levelGapValue2
    return score


scoredList = []

#Append each Dungeon to a list of Tuples containing the description and its score
for dungeon in dungeons:
    scoredList.append((dungeon, fitnessFunction(dungeon)))

#Sort the list
scoredList = sorted(scoredList, key=takeSecond, reverse=True)

#Select a random dungeon description from the Top 5 scored.
top5 = scoredList[:5]
print("Selected output Mission")
print(random.choice(top5))
print("------------------)")
print("Top 5 output Missions")
for dungeonX in scoredList[:5]:
    print(dungeonX)


print(datetime.now() - startTime) #Uncomment to print runtime
