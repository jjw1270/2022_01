#include <iostream>
#include <string>
#include "Pizza.h"
using namespace std;

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
        (p+a) -> getSize();
    }
}