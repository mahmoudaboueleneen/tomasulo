import ReservationStation from "./ReservationStation";

class AddSubReservationStation extends ReservationStation {
    clone(): ReservationStation {
        return new AddSubReservationStation(
            this.tag!,
            this.busy,
            this.op!,
            this.vj,
            this.vk,
            this.qj,
            this.qk,
            this.A,
            this.cyclesLeft
        );
    }
}

export default AddSubReservationStation;
