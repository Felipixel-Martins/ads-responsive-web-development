class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.waitingForOperand = false;
    }

    delete() {
        if (this.waitingForOperand) return;
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.waitingForOperand) {
            this.currentOperand = number;
            this.waitingForOperand = false;
        } else {
            if (number === '.' && this.currentOperand.includes('.')) return;
            if (this.currentOperand === '0' && number !== '.') {
                this.currentOperand = number;
            } else {
                this.currentOperand += number;
            }
        }
    }

    chooseOperation(operation) {
        if (this.waitingForOperand) {
            this.operation = operation;
            return;
        }
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.waitingForOperand = true;
    }

    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                if (current === 0) {
                    alert("Erro: Divisão por zero!");
                    this.clear();
                    this.updateDisplay();
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        this.currentOperand = this.roundResult(result);
        this.operation = undefined;
        this.previousOperand = '';
        this.waitingForOperand = false;
    }

    roundResult(result) {
        return Math.round(result * 1000000) / 1000000;
    }

    percent() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current / 100).toString();
        this.waitingForOperand = true;
    }

    squareRoot() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current) || current < 0) {
            alert("Erro: Raiz quadrada de número negativo!");
            return;
        }
        this.currentOperand = Math.sqrt(current).toString();
        this.waitingForOperand = true;
    }

    square() {
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        this.currentOperand = (current * current).toString();
        this.waitingForOperand = true;
    }

    power() {
        this.chooseOperation('^');
    }

    computePower() {
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        const result = Math.pow(prev, current);
        this.currentOperand = this.roundResult(result);
        this.operation = undefined;
        this.previousOperand = '';
        this.waitingForOperand = false;
    }

    addPi() {
        this.appendNumber(Math.PI.toString());
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.currentOperand;
        if (this.operation != null) {
            this.previousOperandElement.innerText = 
                `${this.previousOperand} ${this.getOperationSymbol(this.operation)}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
    }

    getOperationSymbol(operation) {
        const symbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷',
            '^': '^'
        };
        return symbols[operation];
    }

    handleFunction(action) {
        switch(action) {
            case 'clear':
                this.clear();
                break;
            case 'delete':
                this.delete();
                break;
            case 'percent':
                this.percent();
                break;
            case 'equals':
                if (this.operation === '^') {
                    this.computePower();
                } else {
                    this.compute();
                }
                break;
            case 'sqrt':
                this.squareRoot();
                break;
            case 'square':
                this.square();
                break;
            case 'power':
                this.power();
                break;
            case 'pi':
                this.addPi();
                break;
        }
        this.updateDisplay();
    }
}

// Inicializar a calculadora quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previousOperand');
    const currentOperandElement = document.getElementById('currentOperand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Adicionar event listeners para números
    document.querySelectorAll('[data-number]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.appendNumber(button.dataset.number);
            calculator.updateDisplay();
        });
    });

    // Adicionar event listeners para operadores
    document.querySelectorAll('[data-operator]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.chooseOperation(button.dataset.operator);
            calculator.updateDisplay();
        });
    });

    // Adicionar event listeners para ações
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.handleFunction(button.dataset.action);
        });
    });

    // Adicionar event listeners para funções científicas
    document.querySelectorAll('[data-function]').forEach(button => {
        button.addEventListener('click', () => {
            calculator.handleFunction(button.dataset.function);
        });
    });

    // Suporte para teclado
    document.addEventListener('keydown', (e) => {
        // Prevenir comportamento padrão em algumas teclas
        if (e.key === 'Enter' || e.key === '=' || e.key === 'Escape') {
            e.preventDefault();
        }
        
        if (e.key >= '0' && e.key <= '9') {
            calculator.appendNumber(e.key);
            calculator.updateDisplay();
        } else if (e.key === '.') {
            calculator.appendNumber('.');
            calculator.updateDisplay();
        } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
            calculator.chooseOperation(e.key);
            calculator.updateDisplay();
        } else if (e.key === 'Enter' || e.key === '=') {
            calculator.handleFunction('equals');
            calculator.updateDisplay();
        } else if (e.key === 'Escape') {
            calculator.handleFunction('clear');
            calculator.updateDisplay();
        } else if (e.key === 'Backspace') {
            calculator.handleFunction('delete');
            calculator.updateDisplay();
        } else if (e.key === '%') {
            calculator.handleFunction('percent');
            calculator.updateDisplay();
        }
    });
});