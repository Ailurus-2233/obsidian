在学习深度学习的过程中，主要用到的工具为`PyTorch`，本文主要记录了一些基础的语法功能，以方便更进一步的深度网络的学习设计。

# 1.张量
在pytorch中主要的计算单元，我的理解一个n阶张量就是一个n维数组，pytorch赋予了更多计算手段，以便于之后的高阶张量的计算。

在定义上，张量表示由一个数值组成的数组，这个数组可能有多个维度。具有一个轴的张量对应数学上的向量（vector）；具有两个轴的张量对应数学上的矩阵（matrix）；具有两个轴以上的张量没有特殊的数学名称。

## 1.1张量的创建
pytorch提供了多种多样的张量创建方式


- `arange(n)` 函数类似python原来的 range(n)，创建一个张量，其元素是从0到n-1的整数，其形状为(1, n)
- `zeros((a1, a2, a3, ...))` 创建一个元素全为0的张量，其形状为(a1, a2, a3, ...)
- `ones((a1, a2, a3, ...))` 创建一个元素全为1的张量，其形状为(a1, a2, a3, ...)
- `rand((a1, a2, a3, ...))` 创建一个元素随机的张量，取值范围为\[0, 1)，其形状为(a1, a2, a3, ...)
- `randn((a1, a2, a3, ...))` 创建一个元素满足均值为0，方差为1的正态分布张量，其形状为(a1, a2, a3, ...)
- `normal(mean=n, std=m, size=(a1, a2, a3, ...))` 创建一个元素满足均值为n，方差为m的正态分布张量，其形状为(a1, a2, a3, ...) 当`mean=0`，`std=1`时，等价与`randn()`
- `tensor(arr)` 通过python的列表类型，创建一个张量

## 1.2 张量的操作

pytorch中重构了运算符以及提供其他函数，使张量的运算更加方便

### 1.2.1 基础运算符

对于基础的运算符，张量间的运算方法如下

- `+` 按元素求和
- `-` 按元素求差
- `*` 按元素求积
- `/` 按元素求商
- `**` 按元素求幂
- `%` 按元素求余
- `exp()` 按元素求e的指数
- `==` 按元素判断是否相等

### 1.2.2 函数操作

- `shape` 函数返回张量的形状
- `size()` 函数返回张量的形状
- `reshape(a1, a2, a3, ...)` 函数返回一个新的张量，其形状为指定的形状，形状为(a1, a2, a3, ...)，是进一步的`view()`
- `sum()` 对张量中的所有元素进行求和，会产生一个单元素张量
  - `sum(axis = n)` 在张量中，按维度求和，会产生一个张量，阶数低于计算之前的张量
- `numpy()` 将张量转化为NumPy张量
- `item()` 将张量转化为python的数字或者python原本的float(x) int(x)也可以将张量转化为python的数字，但是仅限只有一个元素的时候
- ` torch.cat((X, Y), dim = n)` 按照第n维度，将X和Y连结在一起，需要除了第n维度的其他形状相同
- `mean()` 对张量的所有元素求平均值
  - `mean(axis = n)` 对张量的第n维元素求平均值

### 1.2.3 广播机制

当两个张量的形状不同时，可以通过广播机制，将其中一个张量的形状转换成另一个张量的形状，能够广播的前提是参与运算的两个张量的形状在逻辑上可一通过复制扩充达到一致。

```python
X = torch.tensor([1, 2, 3])
Y = torch.tensor([[4], [5]])
X + Y
```

```
tensor([[5, 6, 7],
        [6, 7, 8]])
```

### 1.2.4 索引和切片

torch的索引与python索引机制一致，这里记录一些常用操作

- `X[-1]` 在第一维选择最后一个元素
- `X[1:3]` 在第一维选择下标\[1, 3)的连续元素
- `X[1:3, 2:4]` 在第一维选择索引\[1,3)的元素，在第二维选择索引为\[2,4)的元素
- `X[1, 2, ...]` = n 修改张量里具体位置的值

### 1.2.5 内存节省方法

如果使用`Y=X+Y`这种运算方法的话，会导致额外的内存分配，通常使用`Y[:]=X+Y`或`Y+=X`来减少内存开销

# 2. 层与块

为了实现一些复杂的网络，我们引入了神经网络块的概念。块（block）可以描述单个层、由多个层组成的组件或整个模型本身。使用块进行抽象的一个好处是可以将一些块组合成更大的组件，这一过程通常是递归的，如下图所示
![[161550.png]]
从编程的⻆度来看，块由类（class）表示。它的任何子类都必须定义一个将其输入转换为输出的前向传播函数，并且必须存储任何必需的参数。注意，有些块不需要任何参数。最后，为了计算梯度，块必须具有反向传播函数。

## 2.1 自定义块

### 2.1.1 简单的自定义块

每个块必须提供的基本功能：

	1. 将输入数据作为其前向传播函数的参数。
	2. 通过前向传播函数来生成输出。请注意，输出的形状可能与输入的形状不同。
	3. 计算其输出关于输入的梯度，可通过其反向传播函数进行访问。通常这是自动发生的。
	4. 存储和访问前向传播计算所需的参数。
	5. 根据需要初始化模型参数。

在下面的代码片段中，我们从零开始编写一个块。它包含一个多层感知机，其具有256个隐藏单元的隐藏层和一个10维输出层。注意，下面的MLP类继承了表示块的类。我们的实现**只**需要提供我们自己的构造函数（Python中的__init__函数）和前向传播函数。

```python
class MLP(nn.Module):
    def __init__(self):
        super().__init__()
        self.hidden = nn.Linear(20, 256)
        self.out = nn.Linear(256, 10)

    def forward(self, X):
        return self.out(F.relu(self.hidden(X)))
```

新建网络和执行`forward()`方法
```python
net = MLP()
net(X)
```

### 2.1.2 在向前传播中执行其他计算代码
在对于向前传播中，pytorch可以做很多操作，来满足各种各样的架构的复杂运算，如下所示代码，它的向前传播进行四步计算：1.全连接层；2.常数参数乘积计算，全元素+1后计算relu；3.全连接层；4.第一范数大于1，全元素/2；5.返回全元素和。

```python
def forward(self, X):
    X = self.linear(X)
    X = self.relu(torch.mm(self.con_weight, X) + 1)
    X = self.linear(X)
    while X.abs().sum() > 1:
        X /= 2
    return X.sum()
```
那么我们可以随心所欲的在`forward`中实现我们复杂的数学计算，（只要数学公式是正确的）

### 2.1.3 块与块的嵌套

我们可以使用`Sequential()`来简单连接不同的块，当然，使用一个大的块来进行更复杂网络设计也是可行的
```python
chimera = nn.Sequential(NestMLP(), nn.Linear(16,20), FixedHiddenMLP())
```

### 2.1.4 不带参数的自定义层

我们如果想要减去均值，那么可以有如下定义的层，它是一个不包含任何参数的层
```python 
class CenteredLayer(nn.Module):
	def __init__(self):
    	super().__init__()
    def forward(self, X):
    	return X - X.mean()
```

### 2.1.5 带参数的自定义层

同样，参数我们也可以自己来定义，定义方式如下，我们也可以通过forward来定义向前传播的计算方法
```python
class MyLinear(nn.Module):
	def __init__(self, in_units, units):
    	super().__init__()
        self.weight = nn.Parameter(torch.randn(in_units, units))
        self.bias = nn.Parameter(torch.randn(units,))
    def forward(self, X):
    	linear = torch.matmul(X,self.weight.data) + self.bias.data
        return F.relu(linear)
```


## 2.2 块的参数管理

对于块的参数实际上是一个个张量，我只要访问到张量，通过张量的访问方式就能访问到参数。

### 2.2.1 参数访问

当通过`Sequential`类定义模型时，我们可以通过索引来访问模型的任意层。这就像模型是一个列表一样，每层的参数都在其属性中。

```python
print(net[2].state_dict())
```

注意，每个参数都表示为参数类的一个实例。要对参数执行任何操作，首先我们需要访问底层的数值。有几种方法可以做到这一点。有些比较简单，而另一些则比较通用。

```python
print(type(net[2].bias))
print(net[2].bias)
print(net[2].bias.data)
```

参数是复合的对象，包含值、梯度和额外信息。

```python
net[2].weight.grad==None
```

通过for-each可以方便的遍历所有参数
```python
print(*[(name, param.shape)for name, param in net[0].named_parameters()])
print(*[(name, param.shape)for name, param in net.named_parameters()])
```

输出：
```python
('weight', torch.Size([8,4])) ('bias', torch.Size([8]))
('0.weight', torch.Size([8,4])) ('0.bias', torch.Size([8])) ('2.weight', torch.,Size([1,8])) ('2.bias', torch.Size([1]))
```

根据结果，我们不难得到一种新的访问方式
```python
net.state_dict()['2.bias'].data
```

对于嵌套块的，可以像嵌套列表索引一样访问它们

```python
rgnet[0][1][0].bias.data
```

### 2.2.2 参数初始化

通过`net.apply(init_func)`的方法来初始化参数，如下所示

```python
def init_normal(m):
  	if type(m) == nn.Linear:
 		nn.init.normal_(m.weight, mean=0, std=0.01)
        nn.init.zeros_(m.bias)
net.apply(init_normal)
```

其中`.normal_()`与`.zero_()`与之前的创建张量的函数有着相同的作用。常用的内置初始化函数有

```python
nn.init.normal_(m.weight, mean=0, std=0.01)
nn.init.uniform_(m.weight, -10,10)
nn.init.constant_(m.weight,1)
nn.init.xavier_uniform_(m.weight)
nn.init.zeros_(m.bias)
```

当然我们随时都可以直接访问每一层的每一个参数，那么我们能够在初始化函数中，写的一些比较复杂的初始化操作。

```python
net[0].weight.data[:]+=1
net[0].weight.data[0,0]=42
net[0].weight.data[0]
```

# 3. 文件读写
有时我们希望保存训练的模型，以备将来在各种环境中使用，pytorch也提供了一系列方法用来保存数据。

## 3.1 加载与保存张量

对于单个张量，我们可以直接调用load和save函数分别读写它们。
```python
x = torch.arange(4)
torch.save(x,'x-file')
x2 = torch.load('x-file')
```

存储词典，可以用来存储一些权重之类的信息
```python
mydict = {'x': x,'y': y}
torch.save(mydict,'mydict')
mydict2 = torch.load('mydict')
```

## 3.2 加载与保存模型参数

保存单个权重向量（或其他张量）确实有用，但是如果我们想保存整个模型，并在以后加载它们，单独保存每个向量则会变得很麻烦。毕竟，我们可能有数百个参数散布在各处。因此，pytorch提供了内置函数来保存和加载整个网络。需要注意的一个重要细节是，这将保存模型的参数而不是保存整个模型。

``` python
net = MLP()
torch.save(net.state_dict(),'mlp.params')

clone = MLP()
clone.load_state_dict(torch.load('mlp.params'))
```

# 4. GPU

## 4.1 获取计算设备

在pytorch中，CPU和GPU可以用`torch.device('cpu')`和`torch.device('cuda')`表示。应该注意的是，cpu设备意味着所有物理CPU和内存，这意味着pytorch的计算将尝试使用所有CPU核心。然而，gpu设备只代表一个卡和相应的显存。

```python
torch.device('cpu'), torch.device('cuda'), torch.device('cuda:1')
```

```python
(device(type='cpu'), device(type='cuda'), device(type='cuda', index=1))
```

我们还可一获取GPU设备的数量
```python
torch.cuda.device_count()
```

我们可以定义这样的函数来快速获取设备信息
```python
deftry_gpu(i = 0):
    """
    如果存在，则返回gpu(i)，否则返回cpu()
    """
    if torch.cuda.device_count() >= i+1:
        return torch.device(f'cuda:{i}')
    return torch.device('cpu')

def try_all_gpus():#@save
    """
    返回所有可用的GPU，如果没有GPU，则返回[cpu(),]
    """
    devices = [torch.device(f'cuda:{i}') for i in range(torch.cuda.device_count())]
    return devices if devices else [torch.device('cpu')]
```

## 4.2 计算设备的选择

对于张量，如果想使用GPU的话，在创建时可以添加参数`device=cuda:0`，那么将会在第一块GPU上创建这个张量

```python
X = torch.ones(2,3, device=try_gpu()
```

也可以通过复制的手段，将向量添加到另一块GPU上

```python
Z = X.cuda(1)
```

对于模型参数，可以通过`model.to(device='cuda:0')`来将整个参数放到GPU上

```python
net = nn.Sequential(nn.Linear(3,1))
net = net.to(device=try_gpu())
```

### 4.3 其他注意事项

深度学习框架要求计算的所有输入数据都在同一设备上，无论是CPU还是GPU。

不经意地移动数据可能会显著降低性能。一个典型的错误如下：计算GPU上每个小批量的损失，并在命令行中将其报告给用戶（或将其记录在NumPyndarray中）时，将触发全局解释器锁，从而使所有GPU阻塞。最好是为GPU内部的日志分配内存，并且只移动较大的日志。