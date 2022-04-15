#include <iostream>
#include <string>
using namespace std;

class Pizza{
    string *size;
public:
    Pizza() = default;
    ~Pizza();
    void setSize(string s);
    string getSize();
};
Pizza::~Pizza() {
    delete size;
    cout << "�Ҹ��� I Had it all." << endl;
}
void Pizza::setSize(string s){
    size = new string(s);
}
string Pizza::getSize(){
    return *size;
}

class PizzaManager{
    int pNum;
    string size;
    Pizza *p;
public:
    PizzaManager();
    ~PizzaManager();
    void status() const;
};
PizzaManager::PizzaManager(){
    cout << "���� �� ��? ";
    cin >> pNum;
    p = new Pizza[pNum];
    cout << "���� ũ���(small, medium, large)? ";
    cin >> size;
    for(int a = 0; a < pNum; a++){
        (p+a) -> setSize(size);
    }
}
PizzaManager::~PizzaManager(){
    delete [] p;
}
void PizzaManager::status() const{
    for(int a = 0; a < pNum; a++){
        cout << a << ") " << (*(p+a)).getSize() << " Pizza Yammy" << endl;
    }
    cout << endl;
}

int main(){
    PizzaManager pm;
    pm.status();
    return 0;
}