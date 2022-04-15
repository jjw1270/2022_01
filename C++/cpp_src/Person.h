#ifndef PERSON_H
#define PERSON_H

#include <string>
using namespace std;

class Person{
    string name;
    int age;
public:
    Person(string name, int age);
    ~Person();
    void getName() const;
    void getAge() const;
    string setName();
    int setAge();
};

#endif