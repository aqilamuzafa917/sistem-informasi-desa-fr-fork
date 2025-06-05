import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
  FooterLink,
  FooterLinkGroup,
  FooterTitle,
} from "flowbite-react";
import {
  BsFacebook,
  BsInstagram,
  BsTwitter,
  BsGithub,
  BsDribbble,
} from "react-icons/bs";

export default function FooterDesa() {
  return (
    <Footer container className="rounded-none">
    <div className="w-full">
      <div className="grid w-full justify-between sm:flex sm:justify-between md:flex md:grid-cols-1">
        <div>
          <FooterBrand href="/" src="" name="Desa Batujajar Timur" />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-6">
          <div>
            <FooterTitle title="Tentang" />
            <FooterLinkGroup col>
              <FooterLink href="/profildesa">Profil Desa</FooterLink>
              <FooterLink href="#">Visi & Misi</FooterLink>
            </FooterLinkGroup>
          </div>
          <div>
            <FooterTitle title="Ikuti Kami" />
            <FooterLinkGroup col>
              <FooterLink href="#">Facebook</FooterLink>
              <FooterLink href="#">Instagram</FooterLink>
            </FooterLinkGroup>
          </div>
          <div>
            <FooterTitle title="Informasi" />
            <FooterLinkGroup col>
              <FooterLink href="#">Kontak</FooterLink>
              <FooterLink href="#">Layanan</FooterLink>
            </FooterLinkGroup>
          </div>
        </div>
      </div>
      <FooterDivider />
      <div className="w-full sm:flex sm:items-center sm:justify-between">
        <FooterCopyright href="/" by="Desa Batujajar Timur™" year={2023} />
        <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
          <FooterIcon href="#" icon={BsFacebook} />
          <FooterIcon href="#" icon={BsInstagram} />
          <FooterIcon href="#" icon={BsTwitter} />
          <FooterIcon href="#" icon={BsGithub} />
          <FooterIcon href="#" icon={BsDribbble} />
        </div>
      </div>
    </div>
  </Footer>
  );
}
