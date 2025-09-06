import React from "react";

const ManagePlanHeader : React.FC = () => {

    return (
        <section className="m-auto max-w-2xl">
            <header className="text-center">
                <h1 className="text-3xl font-semibold text-app-white">Ulepsz swój plan</h1>

                <div className="mt-5">
                    <p className="text-base font-medium text-app-light-silver">
                        Rozszerz swój plan aby zyskać nowe możliwości dla swojego konta mentora.
                    </p>
                </div>
            </header>
        </section>
    );
}

export default ManagePlanHeader;
