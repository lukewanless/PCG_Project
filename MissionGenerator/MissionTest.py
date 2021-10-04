#Alexander Gellel, u6048084, Australian National University
#An extremely basic validity check, which has been extracted from MissionGenerator.py
#Simply checks whether produced strings are valid against the rules defined by the Grammar
#When run as an automated test, it produced 100% correctness

#It has been modified to allow for user input, as a small checking program 
#and for reference by examiners for the methos of ensuringcorrectness used

mission = input("Copy a Mission here: ")

lockKeyEquilibirum = 0
lockKeyFlag = True

if mission[0] == "Start":
    if mission[-1] == "End":
        print("Valid Start and End")

for word in mission:
    if word == "Lock":
        lockKeyEquilibirum = lockKeyEquilibirum - 1
    if word == "Key":
        lockKeyEquilibirum = lockKeyEquilibirum + 1
    
    if lockKeyEquilibirum < 0:
        lockKeyFlag = False

if lockKeyFlag: 
    print("Mission was Valid")
else:
    print("Mission was invalid")