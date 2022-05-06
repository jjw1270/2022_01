#include <iostream>
#include <string>
#include <cstring>
using namespace std;

class Person {
    char *name;
    int id;
public:
    Person() {cout << "생성자" << endl;};
    Person(Person&& p) { 
        cout << "이동생성자"<<endl;
        this -> id = p.id;
        p.id = 0;
        this -> name = p.name;
        p.name = nullptr;
    };
    Person(const Person& p) { 
        cout << "복사생성자" <<endl;
        this -> id = p.id;
        int len = strlen(p.name);
        this -> name = new char[len + 1];
        strcpy(this -> name, p.name);
    };
};
int main() {
    Person P{};
    Person copyP{P};
    Person moveP{move(P)};
}