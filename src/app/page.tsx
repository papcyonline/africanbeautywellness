import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Tag,
  Drop,
  Scissors,
  PaintBrush,
  HandSoap,
  Flask,
  Leaf,
  Heartbeat,
  Stack,
  Factory,
  Storefront,
  Lightbulb,
  GlobeHemisphereWest,
  Buildings,
  Handshake,
  TrendUp,
  Plant,
  Check,
} from "@phosphor-icons/react/dist/ssr";
import heroImg from "../../public/images/hero.jpg";
import visionImg from "../../public/images/vision.jpg";
import whoImg from "../../public/images/who.jpg";
import whyImg from "../../public/images/why.jpg";
import optionsImg from "../../public/images/options.jpg";
import InView from "@/components/InView";
import SlicedImage from "@/components/SlicedImage";
import ArrowLink from "@/components/ArrowLink";
import styles from "./page.module.css";

const SPLIT_SIZES = "(max-width: 860px) 100vw, 50vw";

const VISION_POINTS = [
  {
    n: "01",
    title: "Factories across Africa",
    body: "World-class beauty and wellness manufacturing facilities, starting in Cameroon and expanding to Nigeria and Uganda.",
  },
  {
    n: "02",
    title: "Thousands of jobs",
    body: "Employment and skills across the value chain, from raw material to finished product.",
  },
  {
    n: "03",
    title: "Value added in Africa",
    body: "Manufacturing that keeps value on the continent instead of exporting raw materials.",
  },
  {
    n: "04",
    title: "80–100% African materials",
    body: "African raw materials and ingredients used wherever it is possible to do so.",
  },
  {
    n: "05",
    title: "Toward a listed group",
    body: "A portfolio of brands built to grow into a publicly listed African company.",
  },
];

const BUSINESS_TYPES = [
  { label: "Skincare", Icon: Drop },
  { label: "Haircare", Icon: Scissors },
  { label: "Cosmetics", Icon: PaintBrush },
  { label: "Personal care", Icon: HandSoap },
  { label: "Essential oils", Icon: Flask },
  { label: "Natural ingredients", Icon: Leaf },
  { label: "Wellness products", Icon: Heartbeat },
  { label: "Raw material suppliers", Icon: Stack },
  { label: "Contract manufacturers", Icon: Factory },
  { label: "Existing brands", Icon: Storefront },
  { label: "New product innovators", Icon: Lightbulb },
];

const WHY_JOIN = [
  {
    Icon: GlobeHemisphereWest,
    title: "A continental movement",
    body: "Stand among the companies shaping a pan-African beauty and wellness manufacturing industry.",
  },
  {
    Icon: Buildings,
    title: "Future manufacturing access",
    body: "Be first in line for manufacturing capacity as our factories come online across Africa, beginning in Cameroon.",
  },
  {
    Icon: Handshake,
    title: "Partners across Africa",
    body: "Connect with suppliers, manufacturers, brands and innovators building the same future.",
  },
  {
    Icon: TrendUp,
    title: "Greater visibility",
    body: "Raise your profile with a featured listing in our growing company directory.",
  },
  {
    Icon: Plant,
    title: "Build the industry",
    body: "Help add value within Africa and grow the continent's beauty and wellness industry.",
  },
];

const OPTION_ONE = [
  "Company registration",
  "Membership of our database",
  "Regular project updates",
];

const OPTION_TWO = [
  "Public company profile",
  "Featured directory listing",
  "Company logo and website link",
  "Product categories",
  "Priority visibility",
];

function Widget({
  Icon,
  label,
  value,
  action,
}: {
  Icon: React.ComponentType<React.ComponentProps<typeof Tag>>;
  label: string;
  value: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={styles.widget}>
      <span className={styles.widgetChip}>
        <Icon size={20} weight="light" />
      </span>
      <span className={styles.widgetText}>
        <span className={styles.widgetLabel}>{label}</span>
        <span className={styles.widgetValue}>{value}</span>
      </span>
      {action}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* ---------------- Hero (minimal) ---------------- */}
      <section className={styles.hero}>
        <div className={styles.heroMedia}>
          <Image
            src={heroImg}
            alt=""
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.heroScrim} aria-hidden="true" />
        <InView className={`container ${styles.heroInner}`}>
          <p className={`eyebrow ${styles.heroEyebrow}`}>
            Manufacturing in Africa. Powered by African ingredients.
          </p>
          <h1 className={styles.heroTitle}>
            Building Africa&rsquo;s Next Beauty &amp; Wellness Manufacturing
            Giant
          </h1>
          <div className={styles.heroActions}>
            <ArrowLink href="/register" variant="primary">
              Join the Vision
            </ArrowLink>
            <ArrowLink href="#vision" variant="outline-light">
              Explore the vision
            </ArrowLink>
          </div>
        </InView>
      </section>

      {/* ---------------- Vision (content left / image right) ---------------- */}
      <section id="vision" className={styles.split}>
        <InView className={styles.splitBody}>
          <p className="eyebrow">Our Vision</p>
          <h2 className={styles.h2}>
            A manufacturing giant, grown from African soil.
          </h2>
          <ol className={styles.points}>
            {VISION_POINTS.map((p) => (
              <li key={p.n} className={styles.point}>
                <span className={styles.pointIndex}>{p.n}</span>
                <div>
                  <h3 className={styles.pointTitle}>{p.title}</h3>
                  <p className={styles.pointText}>{p.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </InView>
        <SlicedImage
          src={visionImg}
          alt="A beauty and wellness manufacturing production line"
          sizes={SPLIT_SIZES}
          className={styles.splitMedia}
          overlay={
            <Widget Icon={Leaf} label="African raw materials" value="80–100%" />
          }
        />
      </section>

      {/* ---------------- Who (image left / content right) ---------------- */}
      <section id="who" className={`${styles.split} ${styles.splitAlt}`}>
        <SlicedImage
          src={whoImg}
          alt="Natural African beauty and wellness ingredients"
          sizes={SPLIT_SIZES}
          className={styles.splitMedia}
          overlay={
            <Widget
              Icon={Storefront}
              label="Now welcoming"
              value="11 categories"
            />
          }
        />
        <InView className={styles.splitBody}>
          <p className="eyebrow">Who We&rsquo;re Looking For</p>
          <h2 className={styles.h2}>Businesses ready to build.</h2>
          <ul className={styles.types}>
            {BUSINESS_TYPES.map(({ label, Icon }) => (
              <li key={label} className={styles.type}>
                <Icon size={22} weight="light" className={styles.typeIcon} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <div className={styles.preference}>
            <p className={styles.preferenceLabel}>We give preference to</p>
            <div className={styles.preferenceList}>
              <span>African companies</span>
              <span>Companies interested in manufacturing in Africa</span>
              <span>Companies using or wanting to use African ingredients</span>
            </div>
          </div>
        </InView>
      </section>

      {/* ---------------- Why (content left / image right) ---------------- */}
      <section id="why" className={styles.split}>
        <InView className={styles.splitBody}>
          <p className="eyebrow">Why Join</p>
          <h2 className={styles.h2}>Reasons to build with us.</h2>
          <ul className={styles.reasons}>
            {WHY_JOIN.map(({ Icon, title, body }) => (
              <li key={title} className={styles.reason}>
                <Icon size={26} weight="light" className={styles.reasonIcon} />
                <div>
                  <h3 className={styles.reasonTitle}>{title}</h3>
                  <p className={styles.reasonText}>{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </InView>
        <SlicedImage
          src={whyImg}
          alt="A confident entrepreneur in the African beauty and wellness industry"
          sizes={SPLIT_SIZES}
          className={styles.splitMedia}
          overlay={
            <Widget
              Icon={GlobeHemisphereWest}
              label="Building a"
              value="Pan-African network"
            />
          }
        />
      </section>

      {/* ---------------- Ways to join (image left / content right) ---------------- */}
      <section id="options" className={`${styles.split} ${styles.splitAlt}`}>
        <SlicedImage
          src={optionsImg}
          alt="A premium range of beauty and wellness products"
          sizes={SPLIT_SIZES}
          className={styles.splitMedia}
          overlay={
            <Widget
              Icon={Tag}
              label="Featured listing"
              value="$29.99"
              action={
                <Link href="/register" className={styles.widgetBtn}>
                  Get listed <ArrowRight size={13} weight="bold" />
                </Link>
              }
            />
          }
        />
        <InView className={styles.splitBody}>
          <p className="eyebrow">Ways to Join</p>
          <h2 className={styles.h2}>Two ways to be part of it.</h2>
          <div className={styles.tiers}>
            <article className={styles.tier}>
              <div className={styles.tierHead}>
                <h3 className={styles.tierName}>Free Expression of Interest</h3>
                <p className={styles.tierPrice}>No cost</p>
              </div>
              <ul className={styles.tierList}>
                {OPTION_ONE.map((item) => (
                  <li key={item}>
                    <Check size={17} weight="bold" className={styles.check} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className={styles.tier}>
              <div className={styles.tierHead}>
                <h3 className={styles.tierName}>Featured Listing</h3>
                <p className={styles.tierPrice}>
                  $29.99 <span className={styles.tierPriceNote}>one-time</span>
                </p>
              </div>
              <ul className={styles.tierList}>
                {OPTION_TWO.map((item) => (
                  <li key={item}>
                    <Check size={17} weight="bold" className={styles.check} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </InView>
      </section>

      {/* ---------------- Final call to action ---------------- */}
      <section className={styles.join}>
        <InView className={`container ${styles.joinInner}`}>
          <p className={`eyebrow ${styles.joinEyebrow}`}>
            Register Your Interest
          </p>
          <h2 className={styles.joinTitle}>Register your interest today.</h2>
          <div className={styles.joinActions}>
            <ArrowLink href="/register" variant="light">
              Join the Vision
            </ArrowLink>
          </div>
        </InView>
      </section>
    </>
  );
}
