**1. 生成一个新的用户控件：**

在添加中选择用户控件，例如创建一个`TopBarView.xaml`，里面有一个Grid布局，其中有一个`TextBlock`

```xml
<UserControl x:Class="StyletDemo.Component.View.TopBarView"
             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
             xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
             xmlns:d="http://schemas.microsoft.com/expression/blend/2008"
             xmlns:local="clr-namespace:StyletDemo.Component.View"
             xmlns:s="https://github.com/canton7/Stylet"
             xmlns:viewModel="clr-namespace:StyletDemo.Component.ViewModel"
             mc:Ignorable="d"
             d:DataContext="{d:DesignInstance viewModel:TopBarViewModel}">
    <Grid>
        <TextBlock TextAlignment="Center" Text="Top Bar" Background="Yellow" Foreground="Blue" FontSize="30" />
    </Grid>
</UserControl>
```

其中需要重点注意的两句话是
```csharp
xmlns:s="https://github.com/canton7/Stylet" // 添加stylet相关的程序集
d:DataContext="{d:DesignInstance viewModel:TopBarViewModel}" // 设定这个view对应的ViewModel
```

**2. 生成对应的ViewModel类**

新建一个类，`TopBarViewModel.cs`，内容可以暂时为空，之后绑定的数据可以在这里面写
```csharp
namespace StyletDemo.Component.ViewModel
{

    public class TopBarViewModel
    {
    }
}
```

**3. 在主窗体的ViewModel中添加依赖注入：**

这样就可以在生成ShellView的时候，通过StyletIoc来注入一个`TopBarViewModel`对象
```csharp
public class ShellViewModel : Screen
{
    [Inject]
    public TopBarViewModel TopBar { get; private set; }
}
```

**4. 在主窗体的View声明对应父类的对象，并使用`View.Model`来绑定对象：**
```xml
<StackPanel>
    <ContentControl s:View.Model="{Binding TopBar}" /> // UserControl的父类是ContentControl
    <!-- ... 其他内容 -->
</StackPanel>
```
