/**
 * DS1302 RTC extension
 * Menyediakan blok untuk membaca dan mengatur waktu pada RTC DS1302
 * Hardware: CE, DAT, CLK
 */

enum TimePart {
        //% block="tahun"
        Year,
        //% block="bulan"
        Month,
        //% block="tanggal"
        Day,
        //% block="hari (1-7)"
        DOW,
        //% block="jam"
        Hour,
        //% block="menit"
        Minute,
        //% block="detik"
        Second
}

declare var Generator: any;

//% color="#b0d12a" iconWidth=50 iconHeight=40
namespace DS1302RTC {

 //% block="Inisialisasi RTC DS1302 RST [ce] CLK [clk] DAT [dat]" blockType="command"
    //% ce.shadow="number" ce.defl=13
    //% clk.shadow="number" clk.defl=2
    //% dat.shadow="number" dat.defl=4
    export function DS1302init(parameter: any, block: any): void {
        const cePin  = parameter.ce.code;
        const clkPin = parameter.clk.code;
        const datPin = parameter.dat.code;

        if (Generator.board === 'arduinonano' || Generator.board === 'arduino') {
            Generator.addInclude('DS1302', '#include <Ds1302.h>');
            Generator.addObject('Ds1302', 'Ds1302', `rtc(${cePin},${clkPin},${datPin});`);
            Generator.addSetup(
                'rtc_begin',
                `rtc.init();`
            );
        }
    }

    //% block="set waktu sekarang tahun [year] bulan [month] tanggal [date] hari [day] jam [hour] menit [minute] detik [second]" blockType="command"
	//% year.shadow="number" year.defl=""
	//% month.shadow="number" month.defl=""
	//% date.shadow="number" date.defl=""
	//% day.shadow="number" day.defl=""
	//% hour.shadow="number" hour.defl=""
	//% minute.shadow="number" minute.defl=""
	//% second.shadow="number" second.defl=""
	export function setDateTime(parameter: any, block: any): void {
		const y  = parameter.year.code;
		const m  = parameter.month.code;
		const d  = parameter.date.code;
		const dow= parameter.day.code;
		const h  = parameter.hour.code;
		const mi = parameter.minute.code;
		const s  = parameter.second.code;

		if (Generator.board === 'arduinonano' || Generator.board === 'arduino') {
			Generator.addInclude('DS1302', '#include <Ds1302.h>');
            Generator.addCode(`if (rtc.isHalted()){
    rtc.setTime(${y}, ${m}, ${d}, ${dow}, ${h}, ${mi}, ${s});
    }`);
			// Generator.addCode(`rtc.setTime(${y}, ${m}, ${d}, ${dow}, ${h}, ${mi}, ${s});`);
		}
	}

    //% block="simpan di loop" blockType="command"
    export function inisiasiloop(parameter: any, block: any): any {
		if (Generator.board === 'arduinonano' || Generator.board === 'arduino') {
			Generator.addInclude('DS1302', '#include <Ds1302.h>');
            Generator.addCode(`Ds1302::DateTime now;
  rtc.getDateTime(&now);`);
		}
	}

	//% block="baca [part] dari RTC" blockType="reporter"
    //% part.shadow="dropdown" part.options="TimePart"
    export function readTime(parameter: any, block: any): any {
    let code = "";
		switch (parameter.part.code) {
			case "Year"     : code = "(2000 + now.year)"; break;
			case "Month"    : code = "now.month"; break;
			case "Date"     : code = "now.day"; break;
			case "DOW"     : code = "now.dow"; break;
			case "Hour"     : code = "now.hour"; break;
			case "Minute"   : code = "now.minute"; break;
			case "Second"   : code = "now.second"; break;
		}

		if (Generator.board === 'arduinonano' || Generator.board === 'arduino') {
			Generator.addInclude('DS1302', '#include <Ds1302.h>');
            Generator.addCode(`${code}`);
		}
	}


    // /**
    //  * Baca bagian waktu
    //  */
    // //% block="Baca %part dari RTC"
    // //% part.defl="jam"
    // export function readTime(part: TimePart): number {
    //     let dt = getDateTime();
    //     switch (part) {
    //         case TimePart.Year: return 2000 + dt.year;
    //         case TimePart.Month: return dt.month;
    //         case TimePart.Day: return dt.day;
    //         case TimePart.Hour: return dt.hour;
    //         case TimePart.Minute: return dt.minute;
    //         case TimePart.Second: return dt.second;
    //         case TimePart.DayOfWeek: return dt.dow;
    //     }
    //     return 0;
    // }

    // export enum TimePart {
    //     //% block="tahun"
    //     Year,
    //     //% block="bulan"
    //     Month,
    //     //% block="tanggal"
    //     Day,
    //     //% block="jam"
    //     Hour,
    //     //% block="menit"
    //     Minute,
    //     //% block="detik"
    //     Second,
    //     //% block="hari ke"
    //     DayOfWeek
    // }

    // // ----- Bagian internal -----

    // interface DateTime {
    //     year: number;
    //     month: number;
    //     day: number;
    //     hour: number;
    //     minute: number;
    //     second: number;
    //     dow: number;
    // }

    // function getDateTime(): DateTime {
    //     let dt: DateTime = {year:0,month:0,day:0,hour:0,minute:0,second:0,dow:0};
    //     pins.digitalWritePin(cePin, 1);
    //     shiftOutByte(0xBF); // burst read command

    //     dt.second = bcd2dec(shiftInByte() & 0x7F);
    //     dt.minute = bcd2dec(shiftInByte() & 0x7F);
    //     dt.hour   = bcd2dec(shiftInByte() & 0x3F);
    //     dt.day    = bcd2dec(shiftInByte() & 0x3F);
    //     dt.month  = bcd2dec(shiftInByte() & 0x1F);
    //     dt.dow    = bcd2dec(shiftInByte() & 0x07);
    //     dt.year   = bcd2dec(shiftInByte() & 0x7F);

    //     pins.digitalWritePin(cePin, 0);
    //     return dt;
    // }

    // function shiftOutByte(val: number): void {
    //     for (let i = 0; i < 8; i++) {
    //         pins.digitalWritePin(datPin, (val & 0x01) ? 1 : 0);
    //         pins.digitalWritePin(clkPin, 1);
    //         control.waitMicros(1);
    //         pins.digitalWritePin(clkPin, 0);
    //         control.waitMicros(1);
    //         val >>= 1;
    //     }
    // }

    // function shiftInByte(): number {
    //     let value = 0;
    //     for (let i = 0; i < 8; i++) {
    //         if (pins.digitalReadPin(datPin))
    //             value |= (1 << i);
    //         pins.digitalWritePin(clkPin, 1);
    //         control.waitMicros(1);
    //         pins.digitalWritePin(clkPin, 0);
    //         control.waitMicros(1);
    //     }
    //     return value;
    // }

    // function writeRegister(addr: number, val: number): void {
    //     pins.digitalWritePin(cePin, 1);
    //     shiftOutByte(addr);
    //     shiftOutByte(val);
    //     pins.digitalWritePin(cePin, 0);
    // }

    // function dec2bcd(dec: number): number {
    //     return ((Math.idiv(dec,10) << 4) + (dec % 10));
    // }
    // function bcd2dec(bcd: number): number {
    //     return ((bcd >> 4) * 10 + (bcd & 0x0F));
    // }
}
