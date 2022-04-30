//�̿�########
#include <iostream>
#include <string>
using namespace std;
class Flower
{
    string name;
public:
    string getName() const { return name; }
    void setName(string name) { this->name = name; }
};
class Graden
{
    Flower *f;
    int fcount;

public:
    Graden() = delete;
    Graden(int count);
    ~Graden();
    void plant(int order, string n);
    void display(void);
};
Graden::Graden(int count) : fcount{count} {
    f = new Flower[fcount];
}
Graden::~Graden() {
    delete [] f;
    
}
void Graden::plant(int order, string n) {

}
void Graden::display(void) {
    
}

class GradenManager {
    int fnum;
    Graden *gd;
    string fname[5] = {"������", "���޷�", "���", "����", "���϶�"};
public:
    GradenManager() {
        cout << "������ �� ������ ���� Ű�� ��ȹ�̽Ű���? ";
        cin >> fnum;
        
        for(int i = 0; i < 5; i++){
            cout << i << ")" << fname[i] << endl;
        }

        gd = new Graden(fnum);

        
    }
    void status() {

    }
};
int main()
{
    GradenManager gm;
    gm.status();
    return 0;
}