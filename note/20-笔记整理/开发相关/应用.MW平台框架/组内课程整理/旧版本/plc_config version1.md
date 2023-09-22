## version 1

配置`Configuration\Card\Omron\plc_config.txt`，对应设备的plc，这个是omron的所以就在omron文件夹下，具体的参数信息需要对照电气提供的表格

### 1 声明卡的类型

```
#CardType:Omron
```

### 2 声明轴号范围

```
ID = [0 to 1]
```

具体数量根据表格中轴的数量来配置，可以在AXIS_STATUS表查看有多少轴。

### 3 每个轴的点位配置

对于每个轴都要进行4个配置
1. 点位到位信号
2. 点位触发信号
3. 点位位置值
4. 点位对应速度

其中所有的数据都要对应表格，MotionVelInfo的数据

![Pasted image 20230810102839](https://cdn.jsdelivr.net/gh/Ailurus-2233/PicGo-ImageRepo@main/work-Image/202308281128778.png)

下面的说明都是针对这个样例

#### 3.1 点位到位信号

``` c
[Mode = Position, GroupName = State]
MFC_AXIS_STATUS.MFC_AXIS_STATUS_Struct_Block.ListOfAxisStatusStruct(1)
{
    InplaceSignal()
    {
	    bool Inplace_1_0 (0) : InPosFlag_0
	    bool Inplace_1_1 (1) : InPosFlag_1
		bool Inplace_1_2 (2) : InPosFlag_2
		bool Inplace_1_3 (3) : InPosFlag_3
		bool Inplace_1_0 (4) : InPosFlag_4
	    bool Inplace_1_1 (5) : InPosFlag_5
		bool Inplace_1_2 (6) : InPosFlag_6
		bool Inplace_1_3 (7) : InPosFlag_7
		bool Inplace_1_8 (8) : InPosFlag_8
	}
}
```

1. `[Mode = Position, GroupName = State]` 用来标识这是一个点位到位信号的配置
2. `MFC_AXIS_STATUS.MFC_AXIS_STATUS_Struct_Block.ListOfAxisStatusStruct` 这个是在AXIS_STATUS表中获取的`TAG_NAME.EVENT_NAME.ITEM_NAME`
3. `ListOfAxisStatusStruct(1)`，表示下标为1的轴
4. 其中Inplace_1_0，这是默认命名，表述的时`Inplace`这个信号组，对应第1个轴的第0个信号，而`InPosFlag`需要在`AxisStatusStruct`中找到对应的`Item_Name`。
5. `bool Inplace_1_0 (0) : InPosFlag_0` 固定搭配，将声明这个`Inplace_1_0`这个信号的值从`InPosFlag_0`获取。


#### 3.2 点位触发信号

```c
[Mode = Position, GroupName = Control]
MFC_AXIS_CMD.MFC_AXIS_CMD_Struct_Block.ListOfAxisCMDStruct(1)    
{
    PositionTrigger()
    {
	    PulseOffOnOff PositionTrigger_1_0 (0)  : PosMove_sw_0
	    PulseOffOnOff PositionTrigger_1_1 (1)  : PosMove_sw_1
		PulseOffOnOff PositionTrigger_1_2 (2)  : PosMove_sw_2
		PulseOffOnOff PositionTrigger_1_3 (3)  : PosMove_sw_3
		PulseOffOnOff PositionTrigger_1_0 (4)  : PosMove_sw_4
	    PulseOffOnOff PositionTrigger_1_1 (5)  : PosMove_sw_5
		PulseOffOnOff PositionTrigger_1_2 (6)  : PosMove_sw_6
		PulseOffOnOff PositionTrigger_1_3 (7)  : PosMove_sw_7
		PulseOffOnOff PositionTrigger_1_8 (8)  : PosMove_sw_8
	}
}
```
1. `[Mode = Position, GroupName = Control]` 用来标识这是一个点位触发信号的配置
2. `MFC_AXIS_CMD.MFC_AXIS_CMD_Struct_Block.ListOfAxisCMDStruct`这个是在AXIS_CMD表中获取的`TAG_NAME.EVENT_NAME.ITEM_NAME`
3. 其中PositionTrigger_1_0，这是默认命名，表述的时`PositionTrigger`这个位置开关，对应第1个轴的第0个开关，而`PosMove_sw`需要在`AxisCMDStruct`中找到对应的`Item_Name`(手动移动开关)。


#### 3.3 点位位置值

```c
[Mode = Position, GroupName = Value]
MFC_AXIS_MotionPAR.MFC_AXIS_MotionPAR_Struct_Block.ListOfAxisMotionPara(1)
{
    Poses()
	{
	   float TF2Unload_放片点 (0) : Pos_0
	   float TF2ST1_PP1取片点 (1) : Pos_1
	   float TF2ST2_PP1取片点 (2) : Pos_2
	   float TF2ST3_PP1取片点 (3) : Pos_3
	   float TF2Unload_放片点 (4) : Pos_4
	   float TF2ST1_PP1取片点 (5) : Pos_5
	   float TF2ST2_PP1取片点 (6) : Pos_6
	   float TF2ST3_PP1取片点 (7) : Pos_7
	   float TF2ST4_PP2取片点 (8) : Pos_8
	}
}
```
1. `[Mode = Position, GroupName = Value]` 用来标识这是一个点位位置值的配置
2. `MFC_AXIS_MotionPAR.MFC_AXIS_MotionPAR_Struct_Block.ListOfAxisMotionPara`这个是在MFC_AXIS_MOTIONPAR表中获取的`TAG_NAME.EVENT_NAME.ITEM_NAME`
3. 命名按照表格命名，Pos是`AxisMotionPara`表中的`Item_Name`

### 3.4 点位对应速度

```c
[Mode = Position, GroupName = Velocity]
MFC_AXIS_MotionPAR.MFC_AXIS_MotionPAR_Struct_Block.ListOfAxisMotionPara(1)
{
	Vels()
	{
		float Vel_1_0(0) : Vel_0
		float Vel_1_1(1) : Vel_1
		float Vel_1_2(2) : Vel_2
		float Vel_1_3(3) : Vel_3
		float Vel_1_4(4) : Vel_4
		float Vel_1_5(5) : Vel_5
		float Vel_1_6(6) : Vel_6
		float Vel_1_7(7) : Vel_7
		float Vel_1_8(8) : Vel_8
	}
}
```
1. `[Mode = Position, GroupName = Velocity]` 用来标识这是一个点位对应速度的配置
2. `MFC_AXIS_MotionPAR.MFC_AXIS_MotionPAR_Struct_Block.ListOfAxisMotionPara`这个是在MFC_AXIS_MOTIONPAR表中获取的`TAG_NAME.EVENT_NAME.ITEM_NAME`
3. 命名按照表格命名，Pos是`AxisMotionPara`表中的`Item_Name`

### 4 轴控制部分

这个部分是固定配置，只需要注意标签和表中一致就好

```c
//轴控制部分
[Mode =	AxisControl]
MFC_AXIS_CMD.MFC_AXIS_CMD_Struct_Block.ListOfAxisCMDStruct(ID)
{
	//回零点
	Home()
	{
		Nop
		PulseOffOnOff GoHome(30)      : Home_sw
	}

	JogPositive()
	{
		float JogVelocity             : JogVel
		float JogAccelerate           : JogAccDec
		Up JogPositiveTrigger         : JogFwd_sw 
	}

	JogPositiveStop()
	{
		float JogVelocity
		float JogAccelerate 
		Down JogPositiveTrigger       : JogFwd_sw
	}

	JogNegative()
	{
		float JogVelocity
		float JogAccelerate 
		Up JogNegativeTrigger         : JogBwd_sw
	}

	JogNegativeStop()
	{
		float JogVelocity
		float JogAccelerate 
		Down JogNegativeTrigger       : JogBwd_sw
	}

	JogStop()
	{
		float JogVelocity
		float JogAccelerate 
		PulseOffOnOff Stop            : Stop_sw
	}

	AbsoluteMove()
	{
		float Destination             : AbsPos
		float Velocity                : Vel
		float Acceleration            : Acc
		float Deceleration            : Dec
		float Jerk                    : Jerk
		PulseOffOnOff AbsoluteTrigger : AbsMove_sw
	}

	RelativeMove()
	{
		float Distance : IncPos
		float Velocity
		float Acceleration
		float Deceleration
		float Jerk
		PulseOffOnOff RelativeTrigger : IncMove_sw
	}

	Servo()
	{
		bool Servo                    : ServoOnOff_sw
	}

	SoftMel()
	{
		float MelPosition             : SoftLimBwd
	}

	SoftPel()
	{
		float PelPosition             : SoftLimFwd
	}

	StopMove()
	{
		PulseOffOnOff Stop            : Stop_sw
	}

	Reset()
	{
		bool Reset                    : Reset_sw
	}

	SetMoveDone()
	{
		PulseOnOff MoveDone(50)       : MoveDone
	}

}
```
### 5 轴状态部分

这个部分是固定配置，只需要注意标签和表中一致就好

```c
//轴状态部分
[Mode = AxisStatus]
MFC_AXIS_STATUS.MFC_AXIS_STATUS_Struct_Block.ListOfAxisStatusStruct(ID)
{
	AxisStatus()
	{
		float ActualPosition    : ActPos
		float ActualVelocity    : ActVel
		float Force             : ActTrq
		long ErrorCode          : ErrCode
		bool IsServo            : ServoOn
		bool CanMove            : MoveAble
		bool HomeFinished       : Homed
		bool CanControl         : ServoOn
		bool Exceptional        : ServoFault
		bool PEL                : PLS
		bool MEL                : NLS
		bool Homing             : Homing
		bool Stillness          : Moving
		bool MoveDoneFlag       : MoveDoneFlag
	}
}
```

### 6 流程命令和状态

这里测试的同样也是固定配置，但是教程文档上面多了注释的配置

```c
MFC_CMD.MFC_CMD_Struct_Block()
{
	SomeCMD()
	{
		bool Start             : Start
		bool CMD_Manual        : Manual
		bool CMD_Auto          : Auto
		bool CMD_Stop          : Stop
		bool CMD_Home          : Home
		bool CMD_Reset         : Reset
		bool CMD_Pause         : Pause
	}
//	Pause()
//	{
//		PluseOnOff CMD_Pause
//	}
}
//MFC_STATUS.MFC_STATUS_Struct_Block()
//{
//	SomeState()
//	{
//		bool State_Pause       : Pause
//	}
//}
```


### 7 与PLC交互部分，参数设置，状态读取，IO控制等

```c
//IO状态部分
TPArr = [0 to 511]
[Mode = Para]
MFC_CMD.MFC_CMD_Struct_Block()
{
	TP(TPArr)
	{
		bool TP : TP_($TPArr)
	}
}
//TL部分，仅用于TP变量的状态显示
MFC_STATUS.MFC_STATUS_Struct_Block()
{
	TL(TPArr)
	{
		bool TL : TL_($TPArr)
	}
}
//IO控制部分
[Mode = IOCmd, GroupName = Whole, GroupIndex = 0]
MFC_CMD.MFC_CMD_Struct_Block()
{
	IOControls()
	{		
		bool ST1_WT吸真空1			( 16, "控制说明信息，暂缺" -> TL_20 )  : TP_20
		bool ST1_WT破真空1			( 17, "控制说明信息，暂缺" -> TL_21 )  : TP_21
		bool ST1_WT吸真空2			( 18, "控制说明信息，暂缺" -> TL_22 )  : TP_22
		bool ST1_WT破真空2			( 19, "控制说明信息，暂缺" -> TL_23 )  : TP_23
	}
}
```

1. 前半部分是声明了TP和TL的变量名称，其中TPArr的数量是和CMD表格中TP的数量是对应的
2. IO控制部分GroupName可以自己定义其他组，GroupIndex得手动增加
3. 一般来说第一组是Whole，及所有的IO都要写在这里面，有分组需求了可以增加
4. `bool ST1_WT吸真空1 (16, "控制说明信息，暂缺" -> TL_20 ) : TP_20` 这个数据要和表CMD_TPInfo和STATUS_TLInfo对照，TL_20、TP_20 是他们在表中的编号。

![Pasted image 20230810135623](https://cdn.jsdelivr.net/gh/Ailurus-2233/PicGo-ImageRepo@main/work-Image/202308281128780.png)

![Pasted image 20230810135633](https://cdn.jsdelivr.net/gh/Ailurus-2233/PicGo-ImageRepo@main/work-Image/202308281128781.png)


### 8 报警配置

```c
//PLC报警
[Mode = Alarm]
MFC_DATA.MFC_DATA_Struct_Block()
{
    Alarms()
    {
        bool Alarm_0 ( 0) : Alarm_0
        bool Alarm_1 ( 1) : Alarm_1
        bool Alarm_2 ( 2) : Alarm_2
        bool Alarm_3 ( 3) : Alarm_3
        bool Alarm_4 ( 4) : Alarm_4
        bool Alarm_5 ( 5) : Alarm_5
        bool Alarm_6 ( 6) : Alarm_6
        bool Alarm_7 ( 7) : Alarm_7
        bool Alarm_8 ( 8) : Alarm_8
        bool Alarm_9 ( 9) : Alarm_9
        bool Alarm_10 ( 10) : Alarm_10
        bool Alarm_11 ( 11) : Alarm_11
        bool Alarm_12 ( 12) : Alarm_12
        bool Alarm_13 ( 13) : Alarm_13
        bool Alarm_14 ( 14) : Alarm_14
        bool Alarm_15 ( 15) : Alarm_15
        bool Alarm_16 ( 16) : Alarm_16
        bool Alarm_17 ( 17) : Alarm_17
        bool Alarm_18 ( 18) : Alarm_18
        bool Alarm_19 ( 19) : Alarm_19
    }
}
[Mode = Warning]
MFC_DATA.MFC_DATA_Struct_Block()
{
    Warnnings() 
    { 
        bool Warning_0 ( 0 ) : Warnning_0
        bool Warning_1 ( 1 ) : Warnning_1
        bool Warning_2 ( 2 ) : Warnning_2
        bool Warning_3 ( 3 ) : Warnning_3
        bool Warning_4 ( 4 ) : Warnning_4
        bool Warning_5 ( 5 ) : Warnning_5
        bool Warning_6 ( 6 ) : Warnning_6
        bool Warning_7 ( 7 ) : Warnning_7
        bool Warning_8 ( 8 ) : Warnning_8
        bool Warning_9 ( 9 ) : Warnning_9
        bool Warning_10 ( 10 ) : Warnning_10
        bool Warning_11 ( 11 ) : Warnning_11
        bool Warning_12 ( 12 ) : Warnning_12
        bool Warning_13 ( 13 ) : Warnning_13
        bool Warning_14 ( 14 ) : Warnning_14
        bool Warning_15 ( 15 ) : Warnning_15
        bool Warning_16 ( 16 ) : Warnning_16
        bool Warning_17 ( 17 ) : Warnning_17
        bool Warning_18 ( 18 ) : Warnning_18
        bool Warning_19 ( 19 ) : Warnning_19
    }
}
```

![Pasted image 20230810140156](https://cdn.jsdelivr.net/gh/Ailurus-2233/PicGo-ImageRepo@main/work-Image/202308281128782.png)

警报的数量和MFC_DATA中描述的数量一致
