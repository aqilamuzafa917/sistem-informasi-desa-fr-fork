import { usePenduduk } from "@/hooks/usePenduduk";
import FormField from "./FormField";
import { ChangeEvent } from "react";

interface PengikutPindahFieldProps {
  pengikut: { nik: string };
  index: number;
  onUpdate: (index: number, nik: string) => void;
  onRemove: (index: number) => void;
}

const PengikutPindahField: React.FC<PengikutPindahFieldProps> = ({
  pengikut,
  index,
  onUpdate,
  onRemove,
}) => {
  const { penduduk, loading, error } = usePenduduk(pengikut.nik);

  return (
    <div key={index} className="flex items-start gap-2">
      <div className="flex-1">
        <FormField
          label={`NIK Pengikut ${index + 1}`}
          name="data_pengikut_pindah"
          value={pengikut.nik}
          onChange={(
            e:
              | ChangeEvent<
                  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >
              | { target: { name: string; value: unknown } },
          ) => onUpdate(index, String(e.target.value))}
          required
          showNama={true}
          namaPenduduk={penduduk?.nama}
          loadingNama={loading}
          errorNama={error}
        />
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="mt-6 rounded-md bg-red-100 p-2 text-red-600 hover:bg-red-200"
      >
        Hapus
      </button>
    </div>
  );
};

export default PengikutPindahField;
