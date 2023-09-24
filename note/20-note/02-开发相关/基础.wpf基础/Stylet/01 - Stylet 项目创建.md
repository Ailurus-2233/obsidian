https://github.com/canton7/Stylet/wiki/Quick-Start

## 项目创建 - .NET Framework 4.0

**方案一：**
1. 创建WPF项目
2. 在nuget中安装`stylet`包
3. 删除默认生成的`MainWindows.xaml`和对应的`MainWindows.xaml.cs`
4. 添加根View和对应的ViewModel，新建文件`XXXMainView.xaml`以及对应的`XXXMainViewModel.cs`。
	**XXXMainView.xaml:**
	```xml
	<Window x:Class="Stylet.Samples.Hello.RootView"
	        xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
	        xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
	        Height="300" Width="300">
	    <TextBlock>Hello, World</TextBlock>
	</Window>
	```
	**XXXMainViewMode.cs:**
	``` csharp
	public class XXXMainViewModel
	{
	}
	```
5. 添加一个`Bootstrapper.cs`并且标识一开始新建的View
	```csharp
	public class Bootstrapper : Bootstrapper<RootViewModel>
	{
	}
	```
6. 修改`App.xaml`中的内容，将Bootstrapper.cs作为资源引用
	``` xml
	<Application x:Class="Stylet.Samples.Hello.App"
	             xmlns="http://schemas.microsoft.com/winfx/2006/xaml/presentation"
	             xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
	             xmlns:s="https://github.com/canton7/Stylet"
	             xmlns:local="clr-namespace:Namespace.To.Bootstrapper">
	    <Application.Resources>
	       <s:ApplicationLoader>
	            <s:ApplicationLoader.Bootstrapper>
	                <local:Bootstrapper/>
	            </s:ApplicationLoader.Bootstrapper>
	        </s:ApplicationLoader>
	    </Application.Resources>
	</Application>
	```
7. 运行程序，即可拿到一个`XXXMainView.cs`中的定义的视图。

**方案二：**
- 在nuget中安装 `stylet.start` 包，它会自动的执行方案一中的步骤，直接启动即可。、


```ad-note
值得注意的是，上面的`<s:ApplicationLoader>`是`ResourceDictionary`的子类。这允许它加载`Stylet`的内置资源。也可以通过设置属性`LoadStyletResources="False"`选择不加载 Stylet 的资源。
```

## 添加自己的资源

**方案一：**
```xml
<Application.Resources>
    <s:ApplicationLoader>
        <s:ApplicationLoader.Bootstrapper>
            <local:Bootstrapper/>
        </s:ApplicationLoader.Bootstrapper>

        <Style x:Key="MyResourceKey">
            ...
        </Style>

        <s:ApplicationLoader.MergedDictionaries>
            <ResourceDictionary Source="MyResourceDictionary.xaml"/>
        </s:ApplicationLoader.MergedDictionaries>
    </s:ApplicationLoader>
</Application.Resources>
```

**方案二：**
```xml
<Application.Resources>
    <ResourceDictionary>
        <ResourceDictionary.MergedDictionaries>
            <s:ApplicationLoader>
                <s:ApplicationLoader.Bootstrapper>
                    <local:Bootstrapper/>
                </s:ApplicationLoader.Bootstrapper>
            </s:ApplicationLoader>

            <ResourceDictionary Source="MyResourceDictionary.xaml"/>
        </ResourceDictionary.MergedDictionaries>

        <Style x:Key="MyResourceKey">
            ...
        </Style>
    </ResourceDictionary>
</Application.Resources>
```