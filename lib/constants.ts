
export const PROGRAMMING_LANGUAGES = [
  { id: 'javascript', name: 'JavaScript', extension: '.js' },
  { id: 'python', name: 'Python', extension: '.py' },
  { id: 'java', name: 'Java', extension: '.java' },
  { id: 'cpp', name: 'C++', extension: '.cpp' },
  { id: 'c', name: 'C', extension: '.c' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts' },
 
] as const


export const DEFAULT_CODE_SAMPLES = {
  javascript: `console.log("Hello, World!");

function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci of 10:", fibonacci(10));`,
  python: `print("Hello, World!")

def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print("Fibonacci of 10:", fibonacci(10))`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        System.out.println("Fibonacci of 10: " + fibonacci(10));
    }
    
    public static int fibonacci(int n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,
  cpp: `#include <iostream>
using namespace std;

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    cout << "Hello, World!" << endl;
    cout << "Fibonacci of 10: " << fibonacci(10) << endl;
    return 0;
}`,
  c: `#include <stdio.h>

int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int main() {
    printf("Hello, World!\\n");
    printf("Fibonacci of 10: %d\\n", fibonacci(10));
    return 0;
}`,
  typescript: `console.log("Hello, World!");

function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log("Fibonacci of 10:", fibonacci(10));`,

} as const

export const USER_COLORS = [
  { name: "Red", code: "#FF0000" },
  { name: "Orange", code: "#FFA500" },
  { name: "Yellow", code: "#FFFF00" },
  { name: "Green", code: "#008000" },
  { name: "Blue", code: "#0000FF" },
  { name: "Purple", code: "#800080" },
  { name: "Cyan", code: "#00FFFF" },
  { name: "Pink", code: "#FFC0CB" },
  { name: "Brown", code: "#A52A2A" },
  { name: "Gray", code: "#808080" },
  { name: "Black", code: "#000000" },
  { name: "White", code: "#FFFFFF" }
]
