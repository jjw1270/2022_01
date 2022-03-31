#include <iostream>
using namespace std;

class Person{
private:
    string name;
    int age;
    int getAge();
public:
    string getName();
    Person();
    Person(string n, int a);
    ~Person();
};
string Person::getName(){
    return name;
}
int Person::getAge(){
    return age;
}
Person::Person() : Person("Anonymous", 0) {}
Person::Person(string n, int a) : name{n}, age{a}{
    cout << "������ ���� " << getName() << "," << getAge() << endl;
}
Person::~Person(){
    cout << "�Ҹ��� ���� " << getName() << endl;
}

int main(){
    Person baby;
    Person child("benny", 10);
    cout << "baby name = " << baby.getName() << endl;
    cout << "child name = " << child.getName() << endl;
}