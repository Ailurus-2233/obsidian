
## 数据绑定

数据绑定是 WPF中的一个核心特性，它的作用是建立数据对象与界面元素之间的连接，实现数据的自动同步和更新。数据绑定可以将数据模型中的数据与界面上的控件进行关联，使得数据的变化能够自动反映在界面上，同时用户对界面元素的操作也能够自动更新到数据模型中。

1. 属性绑定：通过绑定语法将数据对象的属性与界面元素的属性关联，实现双向数据同步。例如，将 ViewModel 中的一个属性与 TextBlock 的 Text 属性绑定，当属性值发生变化时，TextBlock 上显示的文本也会自动更新，反之亦然。
2. 命令绑定：将界面元素的操作（如按钮点击、菜单选择等）与 ViewModel 中的命令关联，实现对应操作的响应。通过命令绑定，可以在 ViewModel 中定义处理逻辑，然后通过界面元素触发对应的命令。
3. 列表绑定：将集合类型的数据与控件（如 ListBox、ListView 等）进行绑定，自动显示集合中的元素。当集合数据发生变化时，控件的显示也会相应地更新。
4. 值转换：数据绑定允许在数据对象和界面元素之间进行值的转换。例如，可以通过转换器将数据模型中的布尔值转换为界面上的可见性（Visibility），从而控制某个元素的显示与隐藏。
5. 数据验证：数据绑定可以结合数据验证机制，确保输入的数据符合预期的规则。如果输入数据不符合要求，界面可以显示错误提示，防止无效数据保存到数据模型中。
6. 动态绑定：数据绑定不仅限于静态的数据对象，还可以在运行时动态地更改绑定的对象或属性，从而实现动态的界面更新。


## 简单的binding


Student.cs
```csharp
class Student: INotifyPropertyChanged // 继承属性更改通知接口
{
	// 声明属性修改实践的Handler
    public event PropertyChangedEventHandler? PropertyChanged;

    private string _name;

    public string Name
    {
        get => _name;
        set
        {
            _name = value;
            // 当属性修改时，激活事件PropertyChanged
            this.PropertyChanged?.Invoke(this, new PropertyChangedEventArgs("Name"));
        }
    }

    public Student(string name)
    {
        this._name = name;
    }
}
```

MainWindow.xaml
```xml
<StackPanel>
    <TextBox x:Name="textBoxName" BorderBrush="Black" Margin="5"/>
    <Button Content="Add Text" Margin="5" Click="Button_Click"/>
</StackPanel>
```

MainWindow.xaml.cs
```csharp
public partial class MainWindow : Window
{
    private Student su;

    public MainWindow()
    {
        InitializeComponent();
	    // 准备数据源
        su = new Student("Su");

		// 声明绑定对象
        var binding = new Binding
        {
            Source = su, // 数据源
            Path = new PropertyPath("Name") // 目标属性
        };

		// 使用binding链接源数据与Binding目标
        BindingOperations.SetBinding(this.textBoxName, TextBox.TextProperty, binding);

		// 使用一句语句完成上面操作
        // textBoxName.SetBinding(TextBox.TextProperty, new Binding("Name") {Source = su = new Student("su")});
    }

    private void Button_Click(object sender, RoutedEventArgs e)
    {
        su.Name += "Hello";
    }
}
```

## 源与路径

### 控件作为源与Binding标记扩展

```xml
<StackPanel>
    <TextBox x:Name="TextBox1" BorderBrush="Black" Margin="5" Text="{Binding ElementName=Slider1, Path=Value}"/>
    <Slider x:Name="Slider1" Maximum="100" Minimum="0" Margin="5"/>
</StackPanel>
```


```ad-danger
因为在C#代码中我们可以直接访问控件对象，所以一般不用Binding的ElementName属性，而是直接把对象赋值给Binding的Source属性
```

### binding的方向以及数据更新



```ad-note
1. 控制数据流向的属性是Mode，他的类型是BindingMode枚举，有Default、TwoWay、OneWay、OnTime、OneWayToSource，Default和TwoWay表现是一致的
2. 控制更新时刻的属性是UpdateSourceTrigger，他的类型是 UpdateSourceTrigger 枚举，可取值为PropertyChanged、LostFocus、Explicit、Default。在TextBox中Default和LostFocus的表现是一致的。
```

### 路径 Path

#### 直接把Binding关联在Binding源的属性上

XAML:
``` xml
<TextBox x:Name="textBox1" BorderBrush="Black" Margin="5" Text="{Binding ElementName=Slider1, Path=Value}"/>
```

C#:
```csharp
Binding binding1 = new Binding(){Path = new PropertyPath("Value"), Source = this.slider1};
this.textBox1.SetBinding(TextBox.TextProperty, binding1);
```

#### 多级路径(通俗可以一路点下去)
在Path同样可以使用点，来表示子级关系，例如`Text.Length`

XAML:
```xml
<TextBox x:Name="textBox2" Text="{Binding Path=Text.Length, ElementName=textBox1, Mode=OneWay}" Margin="5"/>
```

C#:
```csharp
this.textBox2.SetBinding(TextBox.TextProperty, new Binding("Text.Length"){ Source = this.textBox1 ,Mode = BindingMode.OneWay});
```

#### 索引器
对于集合类型，如字符串，列表等可以用索引器，又称为带参属性，同样可以使用`.`，如`Text.[1]`

XAML:
```xml
<TextBox x:Name="textBox2" Text="{Binding Path=Text.[0], ElementName=textBox1, Mode=OneWay}" Margin="5"/>
```

C#:
```csharp
this.textBox2.SetBinding(TextBox.TextProperty, new Binding("Text.[0]"){ Source = this.textBox1 ,Mode = BindingMode.OneWay});
```

#### 斜杠 /

如果数据源是一个集合或者DataView，想使用它的`默认元素`当作Path，可以使用如下的语法
```csharp
List<string> list = new List<string>(){"tom", "tim", "blog", "xxx"};
this.TextBox1.SetBinding(TextBox.TextProperty, new Binding("/"){Source = list});
this.TextBox2.SetBinding(TextBox.TextProperty, new Binding("/[0]"){Source = list, Mode = BindingMode.OneWay});
this.TextBox3.SetBinding(TextBox.TextProperty, new Binding("/Length"){Source = list, Mode = BindingMode.OneWay});
```

```ad-note
注意只是默认元素，也就是列表的第一个，如果想依次显示，则需要用索引器
```

#### 不使用Path
在XAML中Path可以写作一个`.`，这表示数据源本来就是string，int类型的数据，无法指出那些属性来访问这个数据。

XAML:
```xml
<StackPanel>
    <StackPanel.Resources>
        <system:String x:Key="MyString">Hello World</system:String>
    </StackPanel.Resources>
    <TextBlock x:Name="textBlock" Text="{Binding Source={StaticResource MyString}}"/>
</StackPanel>
```

C#：
```csharp
string s = "HelloWorld";
this.textBlock.SetBinding(TextBlock.TextProperty, new Binding(){Source = s});
```

### Binding源

1. 把普通CLR类型单个对象指定为Source。其中包括.NET Framework自带类型的对象和用户自定义类型的对象（如果实现接口`INotifyPropertyChanged`，可在set访问器中激发`PropertyChanged`事件来通知Binding数据已被更新）
2. 把普通CLR集合类型指定为Source。其中包括数组、`List<T>`、`ObservableCollection<T>`等集合类型。
3. 把ADO.NET数据对象指定为Source。包括`DataTable`和`DataView`
4. 使用`XmlDataProvider`把XML数据指定为Source。
5. 把依赖对象指定为Source。
6. 把容器`<DataContext>`指定为Source，届时Path会从DataContext里面查找。
7. 通过`ElementName`指定Source。
8. 通过`Binding的RelativeSource`属性相对的指定Source
9. 把`ObjectDataProvider`对象指定为Source
10. 使用`LINQ`检索得到的数据对象作为Binding的源

#### DataContext 作为控件的Source

样例

```xml
<StackPanel Background="Blue">
    <StackPanel.DataContext>
        <model:Student Id="1" Name="John" Age="20" />
    </StackPanel.DataContext>
    <Grid>
        <StackPanel>
            <TextBox Text="{Binding Id}" />
            <TextBox Text="{Binding Name}" />
            <TextBox Text="{Binding Age}" />
        </StackPanel>
    </Grid>
</StackPanel>
```

上面标签`<StackPanel.DataContext>`为StackPanel的DataContext赋值，他是一个Student对象。那么在之后的Binding就可以不用写Source，他会在Context中查询对应路径。特殊的，如果DataContext中的对象是一个基本类型，如string，int等，在Binding是可以Path都可以省略，只写一个`{Binding}`即可

#### 集合对象作为列表控件的Source

样例：
```csharp
this.listBox.ItemsSource = stuList;
this.listBox.DisplayMemberPath = "Name";
```

这段代码的主要作用就是将stuList作为listBox的源，并将其Name属性展示出来。更复杂的样式显示可以使用`<DataTemplate>`实现。

```ad-note
一般列表绑定的话，通常考虑使用`ObservableCollection<T>`代替`List<T>`，因为他实现了`INotifyCollectionChanged`和`INotifyPropertyChanged`两个接口，能把集合的变化通知给控件，改变会立即显示出来。
```

```ad-danger
ListView和GridView区别
1. ListView是ListBox的派生类，GridView是ViewBase的派生类。
2. ListView的View属性是一个ViewBase类型的对象，所以GridView可以作为ListView的View来使用。
3. GridView的内容属性是Columns，这个属性是GridViewColumnCollection类型对象。
4. GridViewColumn对象中重要的属性是DisplayMemberBinding（类型是BindingBase）可以指定这一列使用什么样的Binding去关联数据，而ViewBox使用的属性是DisplayMemberPath（类型为string）。
5. 如果想用更复杂的结构去展示GridView的表头或数据，则可为GridViewColumn设置HeaderTemplate和CellTemplate属性，他们都是DataTemplate
```


#### ADO作为数据源

```csharp
DataTable dt = this.Load();
this.listView.ItemsSource = dt.DefaultView;
```

```csharp
DataTable dt = this.Load();
this.listView.DataContext = dt;
this.listView.SetBinding(ListView.ItemsSourceProperty, new Binding());
```

#### XML作为数据源

```csharp
XmlDocument doc = new XmlDocument();
doc.Load(@"D:\PathToXml.xml");

XmlDataProvider provider = new XmlDataProvider();
provider.Document = doc;

provider.XPath = @"/Root/Person";

this.listView.DataContext = provider;
this.listView.SetBinding(ListView.ItemsSourceProperty, new Binding());
```

```xml
<ListView x:Name="listView">
    <ListView.View>
        <GridView>
            <GridViewColumn Header="Id" Width="80" DisplayMemberBinding="{Binding XPath=@Id}" />
            <GridViewColumn Header="Name" Width="80" DisplayMemberBinding="{Binding XPath=Name}" />
        </GridView>
    </ListView.View>
</ListView>
```

值得注意的是，在xaml中声明DisplayMemberBinding属性，绑定的类型是XPath，Binding到xml的属性则使用`@Id`，xml的子标签则使用`Name`。

#### LINQ检索结果作为数据源

```csharp
this.listView.ItemsSource=form stu in stuList where stu.Naem.StartsWith("T") select stu;
```

#### 使用Binding的RelativeSource作为数据源

C#:
```csharp
RelativeSource rs = new RelativeSource(RelativeSourceMode.FindAncestor);
rs.AncestorLevel = 1;
rs.AncestorType = typeof(Grid);
Binding binding = new Binding("ActualWidth"){RelativeSource = rs};
this.textBox1.SetBinding(TextBox.WidthProperty, binding);
```

XAML:
```xml
Text="{Binding RelativeSource = {RelativeSource FindAncestor, AncestorType={x:Type Grid}, AncestorLevel = 1}, Path=Name"
```

其中RelativeSource属性的数据类型是RelativeSource类，通过这个类的几个静态或非静态函数我们可以控制它搜索相对数据源的方式。AncestorLevel是指的层级偏移量，AncestorType是查找类型，Mode属性是RelativeSourceMode枚举，可取值为：PreviousData、TemplatedParent、Self和FindAncestor。

### 数据的转化和校验

#### 数据校验

Binding中有属性`ValidationRules`，它的类型是`Collection<ValidationRule>`，可以为每个Binding设置多个数据校验条件，每个条件是ValidationRule类对象。`ValidationRule`是一个抽象类，我们需要派生它并实现`Validate`方法，如果校验通过，需要将ValidationResult的IsValid属性设置为true，反之则为false，并设置一个内容给ErrorContent属性。

```xml
<StackPanel>
    <TextBox x:Name="textBox1" Margin="5"/>
    <Slider x:Name="slider1" Maximum="100" Minimum="-10" Margin="5" />
</StackPanel>
```

```csharp
class RangeValidationRule : ValidationRule
{
    public override ValidationResult Validate(object value, CultureInfo cultureInfo) //重写校验方法
    {
        if (!double.TryParse(value.ToString(), out var d)) return new ValidationResult(false, "输入的值不在0-100之间");
        return d is >= 0 and <= 100 ? new ValidationResult(true, null) : new ValidationResult(false, "输入的值不在0-100之间");
    }
}   
```

```csharp
public DataValidate()
{
    InitializeComponent();

    var binding = new Binding("Value")
    {
        Source = slider1,
        UpdateSourceTrigger = UpdateSourceTrigger.PropertyChanged
    };
    var rule = new RangeValidationRule
    {
        ValidatesOnTargetUpdated = true // 设置当源组件改变时也进行校验
    };
    binding.ValidationRules.Add(rule); // 为binding添加校验规则
    this.textBox1.SetBinding(TextBox.TextProperty, binding);
}
```

可以添加路由，当校验失败时发出提示
```csharp
// binding 上下文
binding.NotifyOnValidationError = true;

this.textBox1.AddHandler(Validation.ErrorEvent, new RoutedEventHandler(this.ValidationError));

// 调用方法
private void ValidationError(object sender, RoutedEventArgs e)
{
    this.textBox1.ToolTip = Validation.GetErrors(this.textBox1).Count > 0 ? Validation.GetErrors(this.textBox1)[0].ErrorContent.ToString() : null;
}
```

#### 数据转换

需要手动实现接口`IValueConverter`

C#:
```csharp
public interface IValueConverter
{
	// 源数据向目标数据转化
	object Convert(object value, Type targetType, object parameter, Culture culture);

	// 双向绑定时，目标数据向源数据转化
	object ConvertBack(object value, Type targetType, object parameter, Culture culture);
}
```

XMAL:
```xml
<Resource>
	<local:Converter x:Key="cvt" />
</Resource>

<Control Source={Binding Path=***, Converter={StaticResource cvt}} />
```

### MulitBinding

多路绑定可以把一组Binding对象组合起来，处在这个集合中的Binding对象可以拥有自己的数据校验与转换机制，他们会聚起来的数据将共同决定传往MulitBinding目标的数据。

```csharp
MulitBinding mb = new MulitBinding() {Mode = BindingMode.OneWay}
mb.Bindings.Add(new Binding() {/* ... */}); // 添加Binding对象
...

mb.Converter = new XXXXConverter(); // 实现了IMulitValueConverter接口的类
```

```ad-danger
1. MulitBinding对于添加子级Binding的顺序是敏感的，因为这个顺序决定了汇集到Converter里数据的顺序
2. MulitBinding的Converter实现的是IMulitValueConverter接口
```

```csharp
public interface IMulitValueConverter
{
	// 源数据向目标数据转化
	object Convert(object[] value, Type targetType, object parameter, Culture culture);

	// 双向绑定时，目标数据向源数据转化
	object ConvertBack(object value, Type[] targetType, object parameter, Culture culture);
}
```

