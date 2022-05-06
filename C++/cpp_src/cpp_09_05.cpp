#include <iostream>
#include <string>
using namespace std;

class Color{
    int id;
    string color;
public:
    Color(int id, const string color) : id{id}, color{color} {
        cout << "������ ����" << endl;
    };
    ~Color() { cout << "�Ҹ��� ȣ��" << endl; };
    Color(const Color &c);  //���� ������
    void changeColor(const string color) { this -> color = color;};
    void show() const { cout << id << ',' << color << endl;}
};
Color::Color(const Color &c) : id{c.id}, color{c.color} {
    cout << "���� ������ ����. ���� ��ü�� �̸� " << this->color << endl;
}

void f(Color color) {  //2. �Լ��� �Ű������� ��ü�� ���޵� ��, Color ��ü�� ���� ������ ȣ��
    color.changeColor("noColor");
}
Color c() {
    Color red(2, "red");
    return red;
}
int main() {
    cout << "20175334_������" << endl;
    cout << "1." << endl;
    Color black(1, "black");

    cout << "2." << endl;
    Color white = black; //��ü�� �ʱ�ȭ �Ͽ� ��ü�� ������ ��, white��ü�� ���� ������ ȣ��

    cout << "3." << endl;
    f(black);

    cout << "4." << endl;
    Color rst = c();  //�Լ��� return Ÿ������ ��ü�� ���޵� ������ �����Ϸ��� ���� ���� �����ڰ�
    //ȣ�� �� ���� �ְ� �ƴ� ���� �ִ�.
    cout << "c() �Լ� ���� ��ü ���� : ";
    rst.show();
    cout << "5." << endl;
}