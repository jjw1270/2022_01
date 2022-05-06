#include <iostream>
#include <string>
using namespace std;

class Color{
    int id;
    string color;
public:
    Color(int id, const string color) : id{id}, color{color} {
        cout << "생성자 실행" << endl;
    };
    ~Color() { cout << "소멸자 호출" << endl; };
    Color(const Color &c);  //복사 생성자
    void changeColor(const string color) { this -> color = color;};
    void show() const { cout << id << ',' << color << endl;}
};
Color::Color(const Color &c) : id{c.id}, color{c.color} {
    cout << "복사 생성자 실행. 원본 객체의 이름 " << this->color << endl;
}

void f(Color color) {  //2. 함수의 매개변수로 객체가 전달될 때, Color 객체의 복사 생성자 호출
    color.changeColor("noColor");
}
Color c() {
    Color red(2, "red");
    return red;
}
int main() {
    cout << "20175334_장윤제" << endl;
    cout << "1." << endl;
    Color black(1, "black");

    cout << "2." << endl;
    Color white = black; //객체로 초기화 하여 객체가 생성될 때, white객체의 복사 생성자 호출

    cout << "3." << endl;
    f(black);

    cout << "4." << endl;
    Color rst = c();  //함수의 return 타입으로 객체가 전달될 때에는 컴파일러에 따라 복사 생성자가
    //호출 될 수도 있고 아닐 수도 있다.
    cout << "c() 함수 리턴 객체 정보 : ";
    rst.show();
    cout << "5." << endl;
}