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
}

