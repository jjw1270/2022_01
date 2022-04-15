#ifndef PIZZA_H
#define PIZZA_H

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

#endif