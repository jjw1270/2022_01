//11번
#include <iostream>
#include <cstring>
#include <string>
using namespace std;

class Person
{
    char* name;

public:
    Person() = default;
    Person(const char* n) {
        name = new char[strlen(n)+1];
        strcpy(name, n);
        cout << "생성자 실행" << endl;
    };
    Person(const Person &person); //복사 생성자
    Person(Person &&p);           //이동 생성자
    ~Person() {
        delete [] name;
        cout << "소멸자 실행" << endl;
    };
    void show(string obj) { 
        if(name == nullptr)
            cout << obj << " name = " << endl;
        else
            cout << obj << " name = " << name << endl;
    };
};
Person::Person(const Person &person) {
    this -> name = person.name;
    int len = strlen(person.name);
    this -> name = new char[len + 1];
    strcpy(this -> name, person.name);
    cout << "복사 생성자 실행. 원본 객체의 이름 : " << name << endl;
}
Person::Person(Person &&p) : name{p.name} {
    p.name = nullptr;
    cout << "이동 생성자 실행" << endl;
}

int main()
{
    cout << "20175334 장윤제" << endl;
    cout << "-1----------" << endl;
    Person dan("daniel");
    Person ben = Person("benny");
    cout << "-2----------" << endl;
    Person mvdan = move(dan);

    cout << "-3----------" << endl;
    Person cpben = ben;
    Person cpmvdan(mvdan);
    cout << "-4----------" << endl;
    dan.show("dan");
    ben.show("ben");
    mvdan.show("mvdan");
    cpben.show("cpben");
    cpmvdan.show("cpmvdan");
    return 0;
}