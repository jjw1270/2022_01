#include <iostream>
#include <string>
#include "account.h"

using namespace std;
using Bank::Account;

Account::Account(string n, int bal) : name{n}, balance{bal} {}
Account::~Account() {
    cout << name << ": °´Ã¼ ¼Ò¸ê" << endl;
}
void Account::deposit(const int money) {
    balance += money;
}
int Account::withdraw(int money){
    if(money > balance){
        money = balance;
        balance = 0;
    }
    else
        balance -= money;
    return money;
}
int Account::check() const{
    return balance;
}
string Account::getOwner() const{
    return name;
}