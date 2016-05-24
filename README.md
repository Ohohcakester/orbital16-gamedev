## Setting Up SFML

* It is recommended to install the binaries available [here](http://www.sfml-dev.org/download/sfml/2.3.2/)
* Note: Only download the binary corresponding to the C++ compiler you use.

Platform-specific setup instructions can be found [here](http://www.sfml-dev.org/tutorials/2.3/)

## Compilation

For Windows users, using Visual Studio is recommended.

Otherwise,

What I use for compiling (depending on where SFML is located on your machine):
```
mkdir _build
g++ -std=c++11 -c *.cpp
g++ -std=c++11 *.o -o _build/Game -lsfml-graphics -lsfml-window -lsfml-system
```

If SFML is placed in the current directory + `/sfml`
```
mkdir _build
g++ -std=c++11 -c *.cpp -I sfml/include
g++ -std=c++11 *.o -o _build/Game -L sfml/lib -lsfml-graphics -lsfml-window -lsfml-system
```

## SFML Sample
* Sample sfml code to be used as a compilation test: [sfml_sample.cpp](https://github.com/Ohohcakester/orbital16-gamedev/blob/master/compilation_tests/sample_game.cpp)

Expected Result:

![sfml_sample](https://github.com/Ohohcakester/orbital16-gamedev/blob/images/images/sfml_sample.gif)

## Versions

#### V0

![v0](https://github.com/Ohohcakester/orbital16-gamedev/blob/images/images/v0.png)

#### V1,V2

![v1v2](https://github.com/Ohohcakester/orbital16-gamedev/blob/images/images/v1v2.png)

#### V3

![v3](https://github.com/Ohohcakester/orbital16-gamedev/blob/images/images/v3.gif)