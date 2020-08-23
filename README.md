# Keyspace
Tool for red teamers to decode keys and master keys from side channel information.  Released at DEF CON 28.

See a live version of the tool here:
https://ggrsecurity.com/personal/~bgraydon/keyspace/

Listen to the talk here:
https://www.youtube.com/watch?v=suN0IsifTyY

Talk Q&A:
https://www.youtube.com/watch?v=vgP4p87Gx_M

# Usage

First tell the software how many pins the lock has, and how many depths are available per pin.  Then, click on the various tabs below that to add rules to the system.  One rule that applies to almost all pin tumbler locks is the MACS.

## Common lock specs: 
Brand | Depths | Pins | Notes, Other Rules
----- | ------ | ---- | ------------------
Schlage | 10, Labelled 0-9 | 5 or 6 | MACS of 7.  2-step usually used.  5 pin most common.  IC system uses extended 7th pin.
Kwikset | 6, Labelled 1-6 | 5 | MACS of 4.  
Sargent | 10, Labelled 1-9 then 0 deepest | 5 or 6 | MACS of 7.  6 pin most common.  IC system uses collar in pins 3 and 4.
Corbin | 6, Labelled 1-6 | 5, 6 or 7 | MACS of 7.  6 pin most common.  IC system uses collar in pins 2, 3, 4 and 5.
BEST A2 | 10, Labelled 0-9 | 6 or 7 | MACS of 9.  2-step always used.  7 pin most common.  IC system uses collar in all pin stacks.
BEST A4 | 6, Labelled 0-5 | 6 or 7 | MACS of 5.  2-step never used.  7 pin most common.  IC system uses collar in all pin stacks.
Yale | 10, Labelled 0-9 | 5 or 6 | MACS of 7.  IC control key uses extended 7th pin cut to a 1 depth.
Medeco | 6, Labelled 1-6 | 5 or 6 | MACS of 2, 3 or 4.  IC system uses collar in pins 3 and 4.
Mul-T-Lock | 5 (inner, 1-5), 4 (outer, A-D) | 5 | No MACS pin-pin, can't have outer C with inner 1 or D with 1 or 2.
Abloy Classic | 6 | 5-11 | No MACS.  Bitting must be key-retaining.
Abloy Protec | 6 | 9 or 11 | No MACS.
Tubular | 8 | 7 | No MACS.

# Troubleshooting

The most common problem encountered is the application hanging due to a large computation.  Rules that restrict each pin stack independantly of one another allow the key space to be calculated on a pin-by-pin basis, rather than expanding it out into the full n^k possibilities.  Rules that have one pin stack dependant on others are much slower, and are identified by an hour-glass symbol on the "add rule" button.  Try to reduce the key space as much as possible with rules without the hour glass notation before using the hour glass ones to narrow it to the final space.  

To help with speed, you may also lower the number of pins or depths while experimenting, and then increase it back to the real number to do your final calculation.

If the problem doesn't seem to be due to slow computation, press "F12" to open the debugger console, and see if any Javascript errors show up.  If so, contact me with the error text and I'll get it fixed.

# Examples

Try out some examples to get you started.  Click "Import a System & Rules" at the bottom and import one of the following JSON examples:

S&G Environmental Keyspace:
```
{"numPins":3,"numDepths":3,"lockType":"pin","labelOffset":"1","rules":[{"name":"retain"}]}
```

Schlage construction keyed system with known change keys:
```
{"numPins":5,"numDepths":10,"lockType":"pin","labelOffset":"0","rules":[{"name":"CK","code":"33983","file":false,"twostep":true,"rotateConst":false,"space":false,"minSpace":null,"angle":true,"depth":true},{"name":"CK","code":"59545","file":false,"twostep":true,"rotateConst":false,"space":false,"minSpace":null,"angle":true,"depth":true},{"name":"CMK","depth":4,"pins":"1","MACS":7},{"name":"MACS","MACS":7}]}
```

Sargent lock with coloured pins visible: 
```
{"numPins":6,"numDepths":10,"lockType":"pin","labelOffset":"1","rules":[{"name":"colourPin","colourPinKeySys":1,"colourPinSet":0,"pinColours":["PLAIN","GREEN","PLAIN","GREEN","PLAIN","PURPLE"]},{"name":"shear","shears":["1","","1","","",""],"nonMK":false,"cache":{"p_shears":[[0],[],[0],[2],[3],[]]}},{"name":"MACS","MACS":7}]}
```

Medeco 12-cut IC System with pin 1 high cut:
```
{"numPins":6,"numDepths":6,"lockType":"medeco2","labelOffset":"1","rules":[{"name":"IC","depth":3,"pins":"3,4","MACS":2},{"name":"MACS","MACS":2},{"name":"onehigh","within":1},{"name":"shear","shears":["1","","","","",""],"nonMK":false,"cache":{"p_shears":[[0],[],[],[],[],[]]}}]}
```

Medeco Sidebar Rights Amplification:
```
{"numPins":6,"numDepths":6,"lockType":"medeco2","labelOffset":"1","rules":[{"name":"CK","code":"D K K M S QD","file":false,"twostep":false,"rotateConst":false,"space":false,"minSpace":null,"angle":true,"depth":true},{"name":"shear","shears":["1","3","4","5","3","4"],"nonMK":false,"cache":{"p_shears":[[0],[2],[3],[4],[2],[3]]}},{"name":"CK","code":"2K 6S 5K 3B 5S 3Q","file":false,"twostep":false,"rotateConst":false,"space":false,"minSpace":null,"angle":true,"depth":true},{"name":"CK","code":"4D 4K 3D 2M 1K 3D","file":false,"twostep":false,"rotateConst":false,"space":false,"minSpace":null,"angle":true,"depth":true}]}
```

# References

[1] J. Weyers, *Showing Keys in Public – What Could Possibly Go Wrong?*: Hackers on Planet Earth, July 18-20, 2014, New York City, NY, USA.  Available: https://www.youtube.com/watch?v=brJMBtO9qTc

[2] B. Graydon and R. Graydon, *Duplicating Restricted Mechanical Keys: DEF CON 27*, August 8-11, 2019, Las Vegas, NV, USA.  Available:https://www.youtube.com/watch?v=ij0c-236O0k

[3] m010ch, *Please Do Not Duplicate Attacking the Knox Box: DEF CON 26*, August 9-12, 2018, Las Vegas, NV, USA.  Available:https://www.youtube.com/watch?v=f4rPDF993qs

[4] S. Towne, *Keyspace Reduction in Mechanical Locks*, SecTor, October 1-3, 2018, Toronto.  Available: https://sector.ca/sessions/keyspace-reduction-in-mechanical-locks/

[5] S. Ramesh, H. Ramprasad, J. Han, *Listen to Your Key: Towards Acoustics-based Physical Key Inference*: HotMobile '20: Proceedings of the 21st International Workshop on Mobile Computing Systems and Applications, March 3-4, 2020, Austin, TX, USA.  Available: https://doi.org/10.1145/3376897.3377853

[6] B. Laxton, K. Wang and S. Savage, *Reconsidering Physical Key Secrecy: Teleduplication via Optical Decoding*: Proceedings of the 15th ACM Conference on Computer and Communications Security (CCS ’08). Association for Computing Machinery, New York, NY, USA, 469–478. Available: https://doi.org/10.1145/1455770.1455830

[7] M. Blaze, “Safecracking for the Computer Scientist” Tech. report, 2004.  Available: https://www.mattblaze.org/papers/safelocks.pdf

[8] H. Fey, "Evolution of Abloy (Part 3)", Han Fey Lock Technologies, The Netherlands, Sep. 2005.  Available: https://toool.nl/images/8/8a/Abloypart3.pdf

[9] datagram, "Mul-T-Lock: Design and Security", Oct. 11, 2012.  Available: http://www.lockpickingforensics.com/articles/mul_t_lock.pdf

[10] B. Bill, “Sargent & Greenleaf Model 0881 Environmental Padlock”, Tech. report, March, 2016.  Available: https://lock-lab.com/wp-content/uploads/2016/03/SG-0881-Article.pdf

[11]  M. Blaze. Cryptology and physical security: *Rights amplification in master-keyed mechanical locks*. IEEE Security and Privacy, 1(2), March/April 2003.

[12] Physical Security, FM 19-30, Department of the Army, Washington, DC, USA, Mar. 1, 1979. [Online]. Available: https://www.jumpjet.info/Emergency-Preparedness/Disaster-Mitigation/Civil/Physical_Security.pdf

[13] T. H. Cormen et. al, *Introduction to Algorithms*, 3rd ed., Cambridge, MA: MIT Press, 2009

[14] T. M. Cover and J. A. Thomas, *Elements of Information Theory*. Hoboken, NJ: Wiley-Interscience, 2006.

[15] A. Feinstein, *Foundations of Information Theory*.  New York: McGraw-Hill, 1958

[16] B. A. Nadel, *Building Security*, New York, NY: McGraw Hill, 2004


